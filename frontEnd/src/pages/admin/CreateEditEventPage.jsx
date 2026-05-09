 import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { PageWrapper } from '../../components/layout/Pagewrapper';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Toggle from '../../components/common/Toggle';
import { useToast } from '../../components/common/Toast';
import { fetchEventById, createEvent, updateEvent } from '../../services/api';
import './CreateEditEventPage.css';

const VENUES = [
  'Main Auditorium', 'Conference Hall A', 'Conference Hall B',
  'Seminar Room 101', 'Seminar Room 102', 'Sports Ground',
  'Library Hall', 'Computer Lab 1', 'Open Air Theatre', 'Online'
];

function CreateEditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = !!id;

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', date: '', time: '',
    venue: '', organizer: '', type: 'college',
    isFree: true, fee: 0, capacity: '', status: 'published',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      fetchEventById(id)
        .then(res => {
          const e = res.data.event;
          setForm({
            title: e.title || '',
            description: e.description || '',
            date: e.date?.slice(0, 10) || '',
            time: e.time || '',
            venue: e.venue || '',
            organizer: e.organizer || '',
            type: e.type || 'college',
            isFree: e.isFree ?? true,
            fee: e.fee || 0,
            capacity: e.capacity || '',
            status: e.status || 'published',
          });
          if (e.image) setImagePreview(e.image);
        })
        .catch(() => toast.error('Failed to load event'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = 'Event title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.date)               e.date        = 'Date is required';
    if (!form.time)               e.time        = 'Time is required';
    if (!form.venue.trim())       e.venue       = 'Venue is required';
    if (!form.organizer.trim())   e.organizer   = 'Organizer is required';
    if (!form.capacity || isNaN(form.capacity) || +form.capacity <= 0) e.capacity = 'Valid capacity is required';
    if (!form.isFree && (!form.fee || +form.fee <= 0)) e.fee = 'Enter a valid fee amount';
    return e;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSaving(true);

    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (imageFile) data.append('image', imageFile);

      if (isEdit) {
        await updateEvent(id, data);
        toast.success('Event updated successfully!');
      } else {
        await createEvent(data);
        toast.success('Event created successfully!');
      }
      navigate('/admin/events');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <><Navbar /><div style={{ padding: 40, textAlign: 'center' }}>Loading...</div></>;

  return (
    <div className="create-event-page">
      <Navbar />
      <PageWrapper>
        <div className="ce__header">
          <button className="ce__back" onClick={() => navigate(-1)}>← Back</button>
          <h1 className="ce__title">{isEdit ? 'Edit Event' : 'Create New Event'}</h1>
          <p className="ce__sub">{isEdit ? `Editing event` : 'Fill in the details below'}</p>
        </div>

        <div className="ce__layout">
          <div className="ce__main">
            {/* Basic info */}
            <div className="ce__card">
              <h3 className="ce__card-title">Basic Information</h3>
              <div className="ce__fields">
                <Input label="Event Title" icon="🎪" value={form.title}
                  onChange={e => set('title', e.target.value)} error={errors.title} />
                <Input label="Description" icon="📝" value={form.description}
                  onChange={e => set('description', e.target.value)} error={errors.description} multiline rows={4} />
                <div className="ce__row-2">
                  <Input label="Organizer" icon="🏛️" value={form.organizer}
                    onChange={e => set('organizer', e.target.value)} error={errors.organizer} />
                  <div className="ce__select-wrap">
                    <label className="ce__select-label">Venue</label>
                    <select className="ce__select" value={form.venue} onChange={e => set('venue', e.target.value)}>
                      <option value="">Select venue...</option>
                      {VENUES.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                    {errors.venue && <p className="ce__select-error">{errors.venue}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="ce__card">
              <h3 className="ce__card-title">Schedule & Capacity</h3>
              <div className="ce__fields">
                <div className="ce__row-3">
                  <Input label="Date" type="date" icon="📅" value={form.date}
                    onChange={e => set('date', e.target.value)} error={errors.date} />
                  <Input label="Time" type="time" icon="🕐" value={form.time}
                    onChange={e => set('time', e.target.value)} error={errors.time} />
                  <Input label="Capacity" type="number" icon="👥" value={form.capacity}
                    onChange={e => set('capacity', e.target.value)} error={errors.capacity} />
                </div>
              </div>
            </div>

            {/* Image upload */}
            <div className="ce__card">
              <h3 className="ce__card-title">Event Image</h3>
              <input type="file" accept="image/*" onChange={handleImageChange}
                style={{ display: 'block', marginBottom: 12 }} />
              {imagePreview && (
                <img src={imagePreview} alt="preview"
                  style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 10 }} />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="ce__sidebar">
            <div className="ce__card">
              <h3 className="ce__card-title">Settings</h3>
              <div className="ce__setting">
                <Toggle label="College Event"
                  sublabel={form.type === 'college' ? 'Internal' : 'External'}
                  checked={form.type === 'college'}
                  onChange={v => set('type', v ? 'college' : 'external')}
                  color="indigo" />
              </div>
              <div className="ce__setting">
                <Toggle label="Free Entry"
                  sublabel={form.isFree ? 'No fee required' : 'Fee required'}
                  checked={form.isFree}
                  onChange={v => set('isFree', v)}
                  color="green" />
              </div>
              {!form.isFree && (
                <div style={{ marginTop: 12 }}>
                  <Input label="Entry Fee (₹)" type="number" icon="💳"
                    value={form.fee} onChange={e => set('fee', e.target.value)} error={errors.fee} />
                </div>
              )}
              <div className="ce__setting" style={{ marginTop: 8 }}>
                <Toggle label="Publish Event"
                  sublabel={form.status === 'published' ? 'Visible to students' : 'Draft'}
                  checked={form.status === 'published'}
                  onChange={v => set('status', v ? 'published' : 'draft')}
                  color="blue" />
              </div>
            </div>

            <div className="ce__actions">
              <Button variant="secondary" fullWidth onClick={() => navigate(-1)} disabled={saving}>Cancel</Button>
              <Button fullWidth size="lg" loading={saving} onClick={handleSave}>
                {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Event'}
              </Button>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}

export default CreateEditEventPage;