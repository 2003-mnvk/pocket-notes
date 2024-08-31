// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import noteImage from '../assets/img1.png'; 
import addBtn from '../assets/addbutton.png';
import lockIcon from '../assets/lock-icon.png';

const NoteGroup = () => {
  const [groups, setGroups] = useState(() => {
    const savedGroups = localStorage.getItem('noteGroups');
    return savedGroups ? JSON.parse(savedGroups) : [];
  });

  const [showPopup, setShowPopup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [currentNote, setCurrentNote] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  const colors = ['#B38BFA', '#FF79F2', '#43E6FC', '#F19576', '#0047FF', '#6691FF'];

  useEffect(() => {
    localStorage.setItem('noteGroups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || {};
    if (selectedGroup) {
      setCurrentNote(savedNotes[selectedGroup]?.content || '');
      setLastUpdated(savedNotes[selectedGroup]?.timestamp || '');
    }
  }, [selectedGroup]);

  const handleAddGroup = () => {
    if (newGroupName && selectedColor) {
      setGroups([...groups, { name: newGroupName, color: selectedColor }]);
      setNewGroupName('');
      setSelectedColor('');
      setShowPopup(false);
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target.className === 'popup-overlay') {
      setShowPopup(false);
    }
  };

  const handleGroupClick = (groupName) => {
    setSelectedGroup(groupName);
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || {};
    setCurrentNote(savedNotes[groupName]?.content || '');
    setLastUpdated(savedNotes[groupName]?.timestamp || '');
  };

  const handleNoteChange = (e) => {
    setCurrentNote(e.target.value);
  };

  const handleSaveNote = () => {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || {};
    const timestamp = new Date().toLocaleString();
    savedNotes[selectedGroup] = { content: currentNote, timestamp };
    localStorage.setItem('notes', JSON.stringify(savedNotes));
    setLastUpdated(timestamp);
    setCurrentNote(''); 
  };

  const getGroupIconLetters = (name) => {
    if (!name) return '';
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return `${words[0].charAt(0)}${words[0].charAt(words[0].length - 1)}`;
    } else {
      return `${words[0].charAt(0)}${words[words.length - 1].charAt(words[words.length - 1].length - 1)}`;
    }
  };

  return (
    <div className="container">
      <div className="sidebar">
        <h2>Pocket Notes</h2>
        <ul className="group-list">
          {groups.map((group, index) => (
            <li key={index} className="group-item" onClick={() => handleGroupClick(group.name)}>
              <div className="group-icon" style={{ backgroundColor: group.color }}>
                {getGroupIconLetters(group.name)}
              </div>
              <span className="group-name">{group.name}</span>
            </li>
          ))}
        </ul>
        <button type="button" className="add-group-btn" onClick={() => setShowPopup(true)}>
          <img src={addBtn} alt="Add Group" className="add-group-icon" />
        </button>
      </div>

      <div className="content-area">
        {selectedGroup ? (
          <div className="note-area">
            <textarea
              value={currentNote}
              onChange={handleNoteChange}
              placeholder="Enter your note here..."
            />
            <button onClick={handleSaveNote} className="save-note-btn">Save Note</button>
            {lastUpdated && <p className="timestamp">Last updated: {lastUpdated}</p>}
          </div>
        ) : (
          <div className="intro-content">
            <img src={noteImage} alt="Pocket Notes" className="note-image" />
            <h2>Pocket Notes</h2>
            <p>Send and receive messages without keeping your phone online.
              Use Pocket Notes on up to 4 linked devices and 1 mobile phone.</p>
            <div className="encryption-info">
              <img src={lockIcon} alt="Lock Icon" className="lock-icon" />
              <span>end-to-end encrypted</span>
            </div>
          </div>
        )}
      </div>

      {showPopup && (
        <div className="popup-overlay" onClick={handleOutsideClick}>
          <div className="popup-content">
            <h3>Create New Group</h3>
            <input
              type="text"
              placeholder="Enter group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <div className="color-picker">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
            <button className="create-group-btn" onClick={handleAddGroup}>
              Create
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteGroup;
