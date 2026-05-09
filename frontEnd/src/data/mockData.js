// ─────────────────────────────────────────────────────────────────────────────
// mockData.js — Mirrors exact MongoDB schemas
// When backend is ready → swap imports from here to API service calls
// Field names here = exact field names in your MongoDB models
// ─────────────────────────────────────────────────────────────────────────────


// ─── EVENTS — matches your eventSchema exactly ────────────────────────────────
// Fields: title, description, date, time, venue, organizer,
//         type, isFree, fee, capacity, registeredCount,
//         status, image, createdBy, createdAt, updatedAt

export const EVENTS = [
  {
    _id:             '1',
    title:           'Tech Fest 2024',
    description:     'Annual technology festival featuring hackathons, workshops, and guest lectures from top industry professionals. Participate in coding challenges, project exhibitions, and panel discussions with leaders from Google, Microsoft, and top startups. Open to all departments. Certificates provided to all participants.',
    date:            '2024-12-15T00:00:00.000Z',
    time:            '10:00 AM',
    venue:           'Auditorium A',
    organizer:       'CSE Department',
    type:            'college',
    isFree:          true,
    fee:             0,
    capacity:        200,
    registeredCount: 145,
    status:          'published',
    image:           'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    createdBy:       'ADM001',
    createdAt:       '2024-11-01T10:00:00.000Z',
    updatedAt:       '2024-11-01T10:00:00.000Z',
  },
  {
    _id:             '2',
    title:           'Cultural Night',
    description:     'A grand celebration of art, music, dance and culture. Featuring live performances by students across all departments. Enjoy folk dance, classical music, stand-up comedy, and a fashion show. Food stalls and games available throughout the evening.',
    date:            '2024-12-20T00:00:00.000Z',
    time:            '6:00 PM',
    venue:           'Open Ground',
    organizer:       'Student Council',
    type:            'college',
    isFree:          false,
    fee:             200,
    capacity:        500,
    registeredCount: 480,
    status:          'published',
    image:           'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    createdBy:       'ADM001',
    createdAt:       '2024-11-05T09:00:00.000Z',
    updatedAt:       '2024-11-05T09:00:00.000Z',
  },
  {
    _id:             '3',
    title:           'Startup Workshop',
    description:     'Learn from successful entrepreneurs about building your startup from scratch. Topics include ideation, MVP development, fundraising, and scaling. Includes hands-on activities, mentorship sessions, and networking with investors. Limited seats — register early.',
    date:            '2024-12-28T00:00:00.000Z',
    time:            '2:00 PM',
    venue:           'Seminar Hall 3',
    organizer:       'InnoHub Foundation',
    type:            'external',
    isFree:          false,
    fee:             500,
    capacity:        60,
    registeredCount: 55,
    status:          'published',
    image:           'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80',
    createdBy:       'ADM001',
    createdAt:       '2024-11-10T11:00:00.000Z',
    updatedAt:       '2024-11-10T11:00:00.000Z',
  },
  {
    _id:             '4',
    title:           'Alumni Meetup',
    description:     'Reconnect with alumni and expand your professional network. Panel discussions on career growth, mentorship sessions, and one-on-one meetings with industry leaders. Alumni from top companies like TCS, Infosys, and Wipro will be present.',
    date:            '2024-11-30T00:00:00.000Z',
    time:            '4:00 PM',
    venue:           'Main Hall',
    organizer:       'Alumni Association',
    type:            'college',
    isFree:          true,
    fee:             0,
    capacity:        300,
    registeredCount: 210,
    status:          'published',
    image:           'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
    createdBy:       'ADM001',
    createdAt:       '2024-10-15T08:00:00.000Z',
    updatedAt:       '2024-10-15T08:00:00.000Z',
  },
  {
    _id:             '5',
    title:           'AI & ML Summit',
    description:     'Deep dive into artificial intelligence and machine learning trends in 2025. Keynotes from researchers at Google Brain, IIT Bombay, and leading academic institutions. Workshop on building real-world AI models included.',
    date:            '2025-01-05T00:00:00.000Z',
    time:            '9:00 AM',
    venue:           'Auditorium A',
    organizer:       'TechCircle India',
    type:            'external',
    isFree:          false,
    fee:             300,
    capacity:        150,
    registeredCount: 98,
    status:          'published',
    image:           'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    createdBy:       'ADM001',
    createdAt:       '2024-11-20T14:00:00.000Z',
    updatedAt:       '2024-11-20T14:00:00.000Z',
  },
  {
    _id:             '6',
    title:           'Sports Day 2024',
    description:     'Annual sports day featuring track & field events, team sports, and friendly competitions. Events include 100m sprint, relay race, football, volleyball, badminton, and more. Prize distribution ceremony at the end of the day.',
    date:            '2024-11-20T00:00:00.000Z',
    time:            '8:00 AM',
    venue:           'Sports Complex',
    organizer:       'Physical Education Dept',
    type:            'college',
    isFree:          true,
    fee:             0,
    capacity:        1000,
    registeredCount: 850,
    status:          'published',
    image:           'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
    createdBy:       'ADM001',
    createdAt:       '2024-10-01T08:00:00.000Z',
    updatedAt:       '2024-10-01T08:00:00.000Z',
  },
  {
    _id:             '7',
    title:           'Photography Workshop',
    description:     'A beginner to intermediate level photography workshop covering composition, lighting, portrait and landscape photography. Bring your own camera or smartphone. Certificate of participation provided.',
    date:            '2025-01-15T00:00:00.000Z',
    time:            '11:00 AM',
    venue:           'Seminar Hall 1',
    organizer:       'Fine Arts Club',
    type:            'college',
    isFree:          true,
    fee:             0,
    capacity:        40,
    registeredCount: 12,
    status:          'draft',
    image:           'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
    createdBy:       'ADM001',
    createdAt:       '2024-12-01T10:00:00.000Z',
    updatedAt:       '2024-12-01T10:00:00.000Z',
  },
];


// ─── HELPER FUNCTIONS — derive "upcoming" / "past" from date ──────────────────
// Your schema has no "upcoming/past" field — it's derived from date
// Use these helpers in every component instead of hardcoding

export function isUpcoming(event) {
  return new Date(event.date) >= new Date();
}

export function isPast(event) {
  return new Date(event.date) < new Date();
}

export function isFull(event) {
  return event.registeredCount >= event.capacity;
}

export function formatFee(event) {
  return event.isFree ? 'FREE' : `₹${event.fee}`;
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day:   'numeric',
    month: 'short',
    year:  'numeric',
  });
}


// ─── STUDENTS — matches your User schema ─────────────────────────────────────
export const STUDENTS = [
  { _id: 'S001', name: 'Arjun Mehta',  email: 'arjun.mehta@college.edu',  phone: '+91 90123 45678', role: 'student', department: 'CSE', studentId: 'S2024CSE001', initials: 'AM', color: '#4F46E5', createdAt: '2022-07-15T00:00:00.000Z' },
  { _id: 'S002', name: 'Priya Sharma', email: 'priya.sharma@college.edu', phone: '+91 91234 56789', role: 'student', department: 'ECE', studentId: 'S2024ECE002', initials: 'PS', color: '#10B981', createdAt: '2022-07-15T00:00:00.000Z' },
  { _id: 'S003', name: 'Rohit Verma',  email: 'rohit.verma@college.edu',  phone: '+91 92345 67890', role: 'student', department: 'ME',  studentId: 'S2024ME003',  initials: 'RV', color: '#F59E0B', createdAt: '2022-07-15T00:00:00.000Z' },
  { _id: 'S004', name: 'Sneha Nair',   email: 'sneha.nair@college.edu',   phone: '+91 93456 78901', role: 'student', department: 'CSE', studentId: 'S2024CSE004', initials: 'SN', color: '#EF4444', createdAt: '2022-07-15T00:00:00.000Z' },
  { _id: 'S005', name: 'Karan Patel',  email: 'karan.patel@college.edu',  phone: '+91 94567 89012', role: 'student', department: 'IT',  studentId: 'S2024IT005',  initials: 'KP', color: '#8B5CF6', createdAt: '2023-07-10T00:00:00.000Z' },
  { _id: 'S006', name: 'Divya Reddy',  email: 'divya.reddy@college.edu',  phone: '+91 95678 90123', role: 'student', department: 'ECE', studentId: 'S2024ECE006', initials: 'DR', color: '#06B6D4', createdAt: '2023-07-10T00:00:00.000Z' },
  { _id: 'S007', name: 'Aditya Kumar', email: 'aditya.kumar@college.edu', phone: '+91 96789 01234', role: 'student', department: 'CSE', studentId: 'S2024CSE007', initials: 'AK', color: '#F97316', createdAt: '2021-07-12T00:00:00.000Z' },
  { _id: 'S008', name: 'Meera Iyer',   email: 'meera.iyer@college.edu',   phone: '+91 97890 12345', role: 'student', department: 'MBA', studentId: 'S2024MBA008', initials: 'MI', color: '#EC4899', createdAt: '2023-07-10T00:00:00.000Z' },
];


// ─── REGISTRATIONS ────────────────────────────────────────────────────────────
// Fields mirror your Registration schema:
// student(ref), event(ref), registrationId,
// registeredAt, paymentStatus, paymentAmount, status, attendanceMarked

export const MY_REGISTRATIONS = [
  {
    _id:              'reg001',
    registrationId:   'REG-2024-001',
    student:          'S001',
    event:            '1',
    registeredAt:     '2024-11-25T10:00:00.000Z',
    paymentStatus:    'free',
    paymentAmount:    0,
    status:           'registered',
    attendanceMarked: false,
  },
  {
    _id:              'reg002',
    registrationId:   'REG-2024-002',
    student:          'S001',
    event:            '2',
    registeredAt:     '2024-11-28T14:00:00.000Z',
    paymentStatus:    'paid',
    paymentAmount:    200,
    status:           'registered',
    attendanceMarked: false,
  },
  {
    _id:              'reg003',
    registrationId:   'REG-2024-003',
    student:          'S001',
    event:            '4',
    registeredAt:     '2024-11-10T09:00:00.000Z',
    paymentStatus:    'free',
    paymentAmount:    0,
    status:           'attended',
    attendanceMarked: true,
  },
  {
    _id:              'reg004',
    registrationId:   'REG-2024-004',
    student:          'S001',
    event:            '6',
    registeredAt:     '2024-11-05T08:00:00.000Z',
    paymentStatus:    'free',
    paymentAmount:    0,
    status:           'attended',
    attendanceMarked: true,
  },
];


// ─── ATTENDANCE RECORDS (admin view) ─────────────────────────────────────────
export const ATTENDANCE_RECORDS = [
  { _id: 'att001', registrationId: 'REG-2024-A01', student: 'S001', event: '1', registeredAt: '2024-11-25T00:00:00.000Z', attendanceMarked: true  },
  { _id: 'att002', registrationId: 'REG-2024-A02', student: 'S002', event: '1', registeredAt: '2024-11-26T00:00:00.000Z', attendanceMarked: false },
  { _id: 'att003', registrationId: 'REG-2024-A03', student: 'S003', event: '1', registeredAt: '2024-11-27T00:00:00.000Z', attendanceMarked: true  },
  { _id: 'att004', registrationId: 'REG-2024-A04', student: 'S004', event: '1', registeredAt: '2024-11-28T00:00:00.000Z', attendanceMarked: true  },
  { _id: 'att005', registrationId: 'REG-2024-A05', student: 'S005', event: '1', registeredAt: '2024-11-29T00:00:00.000Z', attendanceMarked: false },
  { _id: 'att006', registrationId: 'REG-2024-A06', student: 'S006', event: '1', registeredAt: '2024-11-30T00:00:00.000Z', attendanceMarked: true  },
  { _id: 'att007', registrationId: 'REG-2024-A07', student: 'S007', event: '1', registeredAt: '2024-12-01T00:00:00.000Z', attendanceMarked: false },
  { _id: 'att008', registrationId: 'REG-2024-A08', student: 'S008', event: '1', registeredAt: '2024-12-02T00:00:00.000Z', attendanceMarked: true  },
];


// ─── ADMIN STATS ──────────────────────────────────────────────────────────────
export const ADMIN_STATS = {
  totalEvents:        7,
  totalRegistrations: 1838,
  attendanceRate:     87,
  activeEvents:       4,
};


// ─── CHART DATA ───────────────────────────────────────────────────────────────
export const MONTHLY_REGISTRATIONS = [
  { month: 'Jul', registrations: 80  },
  { month: 'Aug', registrations: 145 },
  { month: 'Sep', registrations: 210 },
  { month: 'Oct', registrations: 390 },
  { month: 'Nov', registrations: 520 },
  { month: 'Dec', registrations: 493 },
];

export const ATTENDANCE_TREND = [
  { month: 'Jul', rate: 72 },
  { month: 'Aug', rate: 78 },
  { month: 'Sep', rate: 81 },
  { month: 'Oct', rate: 85 },
  { month: 'Nov', rate: 90 },
  { month: 'Dec', rate: 87 },
];


// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
export const STUDENT_NOTIFICATIONS = [
  { _id: 'n1', message: 'Registration confirmed for Tech Fest 2024', time: '2 hours ago', isRead: false, eventId: '1' },
  { _id: 'n2', message: 'Cultural Night starts tomorrow at 6 PM',    time: '5 hours ago', isRead: false, eventId: '2' },
  { _id: 'n3', message: 'New event added: AI & ML Summit',           time: '1 day ago',   isRead: true,  eventId: '5' },
  { _id: 'n4', message: 'Startup Workshop — only 5 seats left!',     time: '2 days ago',  isRead: true,  eventId: '3' },
];

export const ADMIN_NOTIFICATIONS = [
  { _id: 'an1', message: 'Arjun Mehta registered for Tech Fest 2024', time: '1 hour ago',  isRead: false },
  { _id: 'an2', message: '45/50 seats filled for Cultural Night',     time: '3 hours ago', isRead: false },
  { _id: 'an3', message: 'Startup Workshop registration now closed',  time: '6 hours ago', isRead: true  },
  { _id: 'an4', message: 'New external event request submitted',      time: '1 day ago',   isRead: true  },
];


// ─── LOGGED-IN USERS ─────────────────────────────────────────────────────────
export const STUDENT_USER = {
  _id:        'S001',
  name:       'Arjun Mehta',
  email:      'arjun.mehta@college.edu',
  phone:      '+91 90123 45678',
  role:       'student',
  department: 'CSE',
  studentId:  'S2024CSE001',
  initials:   'AM',
  color:      '#4F46E5',
  createdAt:  '2022-07-15T00:00:00.000Z',
};

export const ADMIN_USER = {
  _id:        'ADM001',
  name:       'Dr. Rajesh Sharma',
  email:      'admin@college.edu',
  phone:      '+91 98765 43210',
  role:       'admin',
  department: 'Administration',
  studentId:  null,
  initials:   'RS',
  color:      '#4F46E5',
  createdAt:  '2020-06-01T00:00:00.000Z',
};


// ─── DROPDOWNS ────────────────────────────────────────────────────────────────
export const DEPARTMENTS = [
  'CSE', 'ECE', 'ME', 'CE', 'IT', 'EEE', 'MBA', 'MCA', 'Physics', 'Chemistry',
];

export const VENUES = [
  'Auditorium A', 'Auditorium B', 'Open Ground',
  'Seminar Hall 1', 'Seminar Hall 2', 'Seminar Hall 3',
  'Main Hall', 'Sports Complex', 'Conference Room', 'Library Hall',
];
