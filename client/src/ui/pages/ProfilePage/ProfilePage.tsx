import React from 'react';
import { IUser } from '../../../api/dataTypes';
import Navigation from '../../Navigation';

interface IProfilePageProps {
  user: IUser;
}

const ProfilePage: React.StatelessComponent<IProfilePageProps> = (props) => (
  <div className="ui">
    <Navigation />
    <div className="page-wrapper">
      <div className="page">
        <div className="grid-container">
          <div className="grid-column col-60">
            <div className="substrate">
              <h1 id="name">{props.user.name} {props.user.lastname}</h1>
              <p>Date of registration: <span id="regDate">{new Date(props.user.regDate).toLocaleDateString()}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
export default ProfilePage;
