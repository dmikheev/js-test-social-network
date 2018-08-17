import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { IUser } from '../../../api/dataTypes';
import { getUser } from '../../../data/actions/userActions';
import { IUserState } from '../../../data/reducers/entites/IUsersState';
import { IAppState } from '../../../data/reducers/IAppState';
import CheckAuthorizePage from '../../common/CheckAuthPage';
import ProfilePage from './ProfilePage';

interface IProfilePathParams {
  userId?: string;
}
interface IProfilePageContainerOwnProps extends RouteComponentProps<IProfilePathParams> {}
interface IProfilePageContainerStateProps {
  userData?: IUserState;
}
interface IProfilePageContainerDispatchProps {
  getUser: (idParam?: string) => void;
}

type IProfilePageContainerProps =
  IProfilePageContainerOwnProps & IProfilePageContainerStateProps & IProfilePageContainerDispatchProps;
class ProfilePageContainer extends React.PureComponent<IProfilePageContainerProps> {
  public componentDidMount() {
    this.props.getUser(this.props.match.params.userId);
  }

  public render() {
    const props = this.props;
    if (!props.userData || props.userData.isFetching) {
      return <div>Loading...</div>;
    }

    return <ProfilePage user={props.userData.data as IUser}/>;
  }
}

type MapStateToPropsFunc =
  (state: IAppState, ownProps: IProfilePageContainerOwnProps) => IProfilePageContainerStateProps;
const mapStateToProps: MapStateToPropsFunc = (state, ownProps) => {
  const userId = ownProps.match.params.userId || state.auth.userId;
  return {
    userData: userId ? state.entities.users[userId] : undefined,
  };
};

type MapDispatchToPropsFunc =
  (dispatch: Dispatch, ownProps: IProfilePageContainerOwnProps) => IProfilePageContainerDispatchProps;
const mapDispatchToProps: MapDispatchToPropsFunc = (dispatch) => bindActionCreators({
  getUser,
}, dispatch);

export default CheckAuthorizePage(true)(
  connect(mapStateToProps, mapDispatchToProps)(ProfilePageContainer),
);
