const register = async (req, res) => {
  try {
    const { username, email, password, role, fullName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Authorization: Only admin can create users with specific roles
    // If no user is logged in (public registration), only allow 'student' role
    let finalRole = 'student';
    
    if (req.user) {
      // If admin is creating user, allow any role
      if (req.user.role === 'admin') {
        finalRole = role || 'student';
      } else {
        // Non-admin users can only create student accounts
        finalRole = 'student';
      }
    } else {
      // Public registration - only student accounts
      finalRole = 'student';
      // Alternatively, disable public registration completely:
      // return res.status(403).json({
      //   success: false,
      //   message: 'Public registration is disabled. Please contact administrator.'
      // });
    }

    // Set permissions based on role
    const permissions = {};
    if (finalRole === 'admin') {
      permissions.canManageUsers = true;
      permissions.canManageLabs = true;
      permissions.canViewAllBookings = true;
      permissions.canApproveBookings = true;
      permissions.canGenerateReports = true;
    } else if (finalRole === 'teacher') {
      permissions.canCreateBookings = true;
      permissions.canViewOwnBookings = true;
      permissions.canViewCalendar = true;
      permissions.canViewPublicCalendar = true;
    } else {
      // student
      permissions.canCreateBookings = true;
      permissions.canViewOwnBookings = true;
      permissions.canViewPublicCalendar = true;
    }

    // Create user
    const user = new User({
      username,
      email,
      password, // In production, make sure to hash this password
      role: finalRole,
      profile: { fullName: fullName || username },
      permissions
    });

    await user.save();

    // Generate token (only if admin is creating, or for public student registration)
    let token = null;
    if (req.user?.role === 'admin' || finalRole === 'student') {
      token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token: token, // Only return token for appropriate cases
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        profile: user.profile
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};