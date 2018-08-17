import React from 'react';

interface ILoginPageProps {
  onFormSubmit(): void;
  onValueChange(name: string, value: string): void;
}

export default class LoginPage extends React.PureComponent<ILoginPageProps> {
  constructor(props: ILoginPageProps) {
    super(props);

    this.onInput = this.onInput.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  public render() {
    const props = this.props;

    return (
      <div className="ui">
        <div className="pattern-cell login">
          <div>
            <div className="substrate">
              <div className="textbox">
                <input name="name" type="text" placeholder="Name" onInput={this.onInput} onKeyDown={this.onKeyDown}/>
              </div>
              <div className="textbox">
                <input
                  name="lastname"
                  type="text"
                  placeholder="Last name"
                  onInput={this.onInput}
                  onKeyDown={this.onKeyDown}
                />
              </div>
              <div className="textbox icon"><i className="fa fa-user"/>
                <input name="login" type="text" placeholder="Login" onInput={this.onInput} onKeyDown={this.onKeyDown}/>
              </div>
              <div className="textbox icon"><i className="fa fa-lock"/>
                <input
                  name="pass"
                  type="password"
                  placeholder="Password"
                  onInput={this.onInput}
                  onKeyDown={this.onKeyDown}
                />
              </div>
              <button id="button" className="rectangular green" onClick={props.onFormSubmit}>
                <i className="fa fa-sign-in-alt" />
                <span>Log In</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private onInput(event: React.FormEvent<HTMLInputElement>) {
    const eventTarget = event.target as HTMLInputElement;

    this.props.onValueChange(eventTarget.name, eventTarget.value);
  }

  private onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.keyCode === 13) {
      this.props.onFormSubmit();
    }
  }
}
