const Notification = require('../models/Notification');

class NotificationHelper {
  // Buat notifikasi baru
  static async createNotification(data) {
    try {
      const notification = await Notification.create(data);
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Notifikasi booking approved
  static async notifyBookingApproved(userId, booking) {
    const notification = await this.createNotification({
      recipient: userId,
      booking: booking._id,
      message: `Booking laboratorium Anda untuk "${booking.activityTitle}" pada ${new Date(booking.bookingDate).toLocaleDateString('id-ID')} pukul ${booking.startTime} telah DISETUJUI.`,
      link: `/teacher/schedule/${booking._id}`
    });
    
    return notification;
  }

  // Notifikasi booking rejected
  static async notifyBookingRejected(userId, booking, reason = '') {
    const reasonText = reason ? ` Alasan: ${reason}` : '';
    const notification = await this.createNotification({
      recipient: userId,
      booking: booking._id,
      message: `Booking laboratorium Anda untuk "${booking.activityTitle}" telah DITOLAK.${reasonText}`,
      link: `/teacher/booking/${booking._id}`
    });
    
    return notification;
  }

  // Notifikasi booking pending
  static async notifyBookingPending(userId, booking) {
    const notification = await this.createNotification({
      recipient: userId,
      booking: booking._id,
      message: `Booking laboratorium Anda untuk "${booking.activityTitle}" telah diajukan dan sedang menunggu persetujuan admin.`,
      link: `/teacher/booking/${booking._id}`
    });
    
    return notification;
  }

  // Notifikasi schedule reminder (1 jam sebelum)
  static async notifyScheduleReminder(userId, booking) {
    const notification = await this.createNotification({
      recipient: userId,
      booking: booking._id,
      message: `Pengingat: Sesi "${booking.activityTitle}" di ${booking.labName} akan dimulai dalam 1 jam (${booking.startTime}).`,
      link: `/teacher/schedule/${booking._id}`
    });
    
    return notification;
  }

  // Notifikasi system (umum)
  static async notifySystem(userId, message, link = '') {
    const notification = await this.createNotification({
      recipient: userId,
      message: message,
      link: link
    });
    
    return notification;
  }
}

module.exports = NotificationHelper;