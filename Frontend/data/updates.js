// Shared updates data used by UpdatesScreen and SlideMenu
const SAMPLE = [
  { 
    id: 'u1', 
    date: new Date(2025, 9, 25, 9, 12), 
    title: 'Menu update', 
    description: 'New biryani will be served on Friday. Try it with raita!', 
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=60', 
    category: 'Mess Updates', unread: false },
  { 
    id: 'u2', 
    date: new Date(2025, 9, 25, 12, 30), 
    title: 'Reminder', 
    description: 'Please rate today\'s lunch to help us improve food quality.', 
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=60', 
    category: 'General Announcements', unread: false },
  { 
    id: 'u3', 
    date: new Date(2025, 9, 27, 8, 5), 
    title: 'Festive special', 
    description: 'Signup sheet available for the festive special next week. Limited seats.', 
    image: 'https://images.unsplash.com/photo-1605194000384-439c3ced8d15?auto=format&fit=crop&q=80&w=687', 
    category: 'General Announcements', unread: false },
  { 
    id: 'u4', 
    date: new Date(2025, 9, 29, 10, 45), 
    title: 'Maintenance notice', 
    description: 'Water shutdown at noon today; please plan accordingly.', 
    image: 'https://media.istockphoto.com/id/184600781/photo/a-water-truck-spraying-the-street.jpg?s=2048x2048&w=is&k=20&c=WJHBobodDYGQURcEfTA9rbSZnwX_akUZS9Vn0DNjMuk=', 
    category: 'Ticket / Issue Updates', priority: 'urgent', unread: true },
  { 
    id: 'u5', 
    date: new Date(2025, 9, 29, 18, 5), 
    title: 'Tonight\'s dinner', 
    description: 'We are adding extra salad portions to tonight\'s dinner.', 
    image: 'https://images.unsplash.com/photo-1568158879083-c42860933ed7?auto=format&fit=crop&q=60&w=800', 
    unread: true },
];

function getUnreadCount() {
  return SAMPLE.reduce((s, it) => s + (it.unread ? 1 : 0), 0);
}

export { SAMPLE, getUnreadCount };
