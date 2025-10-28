// Shared updates data used by UpdatesScreen and SlideMenu
const SAMPLE = [
  { id: 'u1', date: new Date(2025, 9, 25, 9, 12), title: 'Menu update', description: 'New biryani will be served on Friday. Try it with raita!', image: require('../assets/icon.png'), category: 'Mess Updates', unread: false },
  { id: 'u2', date: new Date(2025, 9, 25, 12, 30), title: 'Reminder', description: 'Please rate today\'s lunch to help us improve food quality.', image: require('../assets/icon.png'), category: 'General Announcements', unread: false },
  { id: 'u3', date: new Date(2025, 9, 27, 8, 5), title: 'Festive special', description: 'Signup sheet available for the festive special next week. Limited seats.', image: require('../assets/icon.png'), category: 'General Announcements', unread: false },
  { id: 'u4', date: new Date(2025, 9, 29, 10, 45), title: 'Maintenance notice', description: 'Water shutdown at noon today; please plan accordingly.', image: require('../assets/icon.png'), category: 'Ticket / Issue Updates', priority: 'urgent', unread: true },
  { id: 'u5', date: new Date(2025, 9, 29, 18, 5), title: 'Tonight\'s dinner', description: 'We are adding extra salad portions to tonight\'s dinner.', image: require('../assets/icon.png'), unread: true },
];

function getUnreadCount() {
  return SAMPLE.reduce((s, it) => s + (it.unread ? 1 : 0), 0);
}

export { SAMPLE, getUnreadCount };
