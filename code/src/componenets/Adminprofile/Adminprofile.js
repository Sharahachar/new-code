import React, { useState } from 'react';
import './Adminprofile.css';
import { useNavigate } from 'react-router-dom';
import img2 from "../../assets/profile.png";

function Myprofile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(img2);
  const [employeeInfo, setEmployeeInfo] = useState({
    fullName: 'Shahbaz Khan',
    employeeId: 'SS1234',
    emailId: 'shahbaz@gmail.com',
    personalNumber: '9876543210',
    personalName: 'Shahbaz',
    bloodGroup: 'O+',
    nationality: 'Indian',
    state: 'Telangana',
    permanentAddress: 'HYD',
    currentAddress: 'HYD',
    emergencyContact: {
      name: 'Shoeb',
      mobileNumber: '1234567890',
      address: 'HYD',
      relation: 'Brother'
    },
    professionalBackground: {
      jobTitle: 'Software Engineer',
      companyName: 'Tech Company',
      educationQualification: 'Mechanical Engineer',
      certification: 'Certified Java Developer',
      skills: ['React', 'JavaScript', 'CSS']
    }
  });

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value
    }));
  };

  const handleChangeNested = (e, section) => {
    const { name, value } = e.target;
    setEmployeeInfo((prevInfo) => ({
      ...prevInfo,
      [section]: {
        ...prevInfo[section],
        [name]: value
      }
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderInput = (label, value, name, section) => (
    <div className="input-row">
      <span className="input-label">{label}</span>
      {isEditing ? (
        <input
          type="text"
          name={name}
          value={value}
          onChange={(e) => handleChangeNested(e, section)}
        />
      ) : (
        <span className="input-value">{value}</span>
      )}
    </div>
  );

  const handleBack = () => {
    navigate(0); // Navigate to the previous page
  };

  return (
    <div className="admin-profile">
      <div className="admin-profile-content">
        <div className="admin-profile-image">
          <img src={profileImage} alt="Profile" />
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          )}
        </div>
        <div className="admin-profile-data">
          <div className="admin-profile-section">
            <h1 className='admin-profile-info'>About Information</h1>
            {renderInput('Full Name:', employeeInfo.fullName, 'fullName')}
            {renderInput('Employee ID:', employeeInfo.employeeId, 'employeeId')}
            {renderInput('Email ID:', employeeInfo.emailId, 'emailId')}
          </div>
          <div className="admin-profile-section">
            <h1 className='admin-profile-info'>Personal Information</h1>
            {renderInput('Personal Number:', employeeInfo.personalNumber, 'personalNumber')}
            {renderInput('Personal Name:', employeeInfo.personalName, 'personalName')}
            {renderInput('Blood Group:', employeeInfo.bloodGroup, 'bloodGroup')}
            {renderInput('Nationality:', employeeInfo.nationality, 'nationality')}
            {renderInput('State:', employeeInfo.state, 'state')}
            {renderInput('Permanent Address:', employeeInfo.permanentAddress, 'permanentAddress')}
            {renderInput('Current Address:', employeeInfo.currentAddress, 'currentAddress')}
          </div>
          <div className="admin-profile-section">
            <h1 className='admin-profile-info'>Emergency Contact Details</h1>
            {renderInput('Contact Name:', employeeInfo.emergencyContact.name, 'name', 'emergencyContact')}
            {renderInput('Mobile Number:', employeeInfo.emergencyContact.mobileNumber, 'mobileNumber', 'emergencyContact')}
            {renderInput('Address:', employeeInfo.emergencyContact.address, 'address', 'emergencyContact')}
            {renderInput('Relation:', employeeInfo.emergencyContact.relation, 'relation', 'emergencyContact')}
          </div>
          <div className="admin-profile-section">
            <h1 className='admin-profile-info'>Professional Background</h1>
            {renderInput('Job Title:', employeeInfo.professionalBackground.jobTitle, 'jobTitle', 'professionalBackground')}
            {renderInput('Company Name:', employeeInfo.professionalBackground.companyName, 'companyName', 'professionalBackground')}
            {renderInput('Education Qualification:', employeeInfo.professionalBackground.educationQualification, 'educationQualification', 'professionalBackground')}
            {renderInput('Certification:', employeeInfo.professionalBackground.certification, 'certification', 'professionalBackground')}
            {renderInput('Skills:', employeeInfo.professionalBackground.skills.join(', '), 'skills', 'professionalBackground')}
          </div>
        </div>
      </div>
      <button className="admin-profile-button" onClick={handleBack}>Back</button>
      <button className="admin-edit-button" onClick={handleEditClick}>
        {isEditing ? 'Save' : 'Edit'}
      </button>
    </div>
  );
}

export default Myprofile;
