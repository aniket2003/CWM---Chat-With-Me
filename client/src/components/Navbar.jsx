import React, { useEffect, useState } from "react";
import {
  useGetUserMutation,
  useSendLogoutMutation,
} from "../redux/auth/authApiSlice";
import { useNavigate } from "react-router-dom";
import "../css/Navbar.css";
import FindUserModal from "./FindUserModal/FindUserModal";
const Navbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isFindUserModalOpen, setFindUserModalopen] = useState(false);
  const navigate = useNavigate();
  const [getuser, { isLoading }] = useGetUserMutation();
  const [logout, { isLoadinglogout }] = useSendLogoutMutation();
  const [data, setData] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState({
    username: false,
    email: false,
    bio: false,
  });

  const handleEdit = (field) => {
    setIsEditing((prevState) => ({
      ...prevState,
      [field]: !prevState[field], // Toggle the edit state for the field
    }));
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result); // Preview the image
      };
      reader.readAsDataURL(file);
    }
  };
  async function getUserDetails() {
    const data = await getuser().unwrap();
    setData(data);
  }

  useEffect(() => {
    getUserDetails();
  }, []);

  const handlelogout = async () => {
    const data = await logout().unwrap();
    navigate("/login");
    console.log(data);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const toggleFindUserModal = ()=>{
    setFindUserModalopen(!isFindUserModalOpen);
  }

  return (
    <div className="Navbar">

    <nav className="navbar">
      <div className="navbar-left">
        <button className="dropdown-btn" onClick={toggleDropdown}>
          <div className="hamburger">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        </button>
        {isDropdownOpen && (
          <div className="dropdown-content">
            <a href="#!" onClick={handlelogout}>
              Logout
            </a>
            <a href="#!" onClick={toggleFindUserModal}>Find User</a>
          </div>
        )}
      </div>

      <div className="navbar-center">
        <img
          src="https://res.cloudinary.com/ds7iiiezf/image/upload/v1728023544/CWM/Logo/uxwricp0salddeom4ipr.png"
          alt="Logo"
          className="navbar-logo"
          />
      </div>

      <div className="navbar-right">
        <button className="profile-btn" onClick={toggleModal}>
          <img src={data.ProfilePic} alt="Profile" className="profile-pic" />
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={toggleModal}>
              &times;
            </span>
            <h2>Edit Profile</h2>
            <form className="NavbarForm">
              {/* Profile Picture Section */}
              <div className="profile-pic-section">
                <label htmlFor="profilepic">Profile Picture</label>
                <div className="profile-pic-preview">
                  {previewImage ? (
                    <img
                    src={previewImage}
                    alt="Profile Preview"
                    className="profilepic_modal"
                    />
                  ) : (
                    <img
                    src={data.ProfilePic} // Use existing profile picture
                    alt="Current Profile"
                    className="profilepic_modal"
                    />
                  )}
                </div>
                <input
                  type="file"
                  id="profilepic"
                  name="profilepic"
                  accept="image/*"
                  className="Navbar_FileInput"
                  onChange={handleFileSelect}
                />
              </div>

              <label htmlFor="username">Username:</label>
              <div className="username_div">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={data.username}
                  readOnly={!isEditing.username}
                  // onChange={(e) => setUsername(e.target.value)}
                  />
                <button type="button" onClick={() => handleEdit("username")}>
                  {isEditing.username ? "Save" : "Edit"}
                </button>
              </div>

              <label htmlFor="bio">Bio:</label>
              <textarea
                id="bio"
                name="bio"
                value={data.bio}
                readOnly={!isEditing.bio}
                // onChange={(e) => setBio(e.target.value)}
                ></textarea>
              <button type="button" onClick={() => handleEdit("bio")}>
                {isEditing.bio ? "Save" : "Edit"}
              </button>

              <button type="submit">Save Changes</button>
              <button type="button" onClick={toggleModal}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
    {isFindUserModalOpen && (<FindUserModal isOpen={isFindUserModalOpen} onClose={toggleFindUserModal}/>)}
      </div>
  );
};

export default Navbar;
