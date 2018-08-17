import React from 'react';
import Navigation from '../../Navigation';
import SearchItem, { ISearchItem } from './SearchItem';

interface ISearchPageProps {
  items: ISearchItem[];
  onQueryInput(searchQuery: string): void;
  onSearchItemButtonClick(searchItem: ISearchItem): void;
}

class SearchPage extends React.PureComponent<ISearchPageProps> {
  constructor(props: ISearchPageProps) {
    super(props);

    this.onQueryInput = this.onQueryInput.bind(this);
  }

  public render() {
    const props = this.props;
    const searchItemsHtml = props.items.map((item) => (
      <SearchItem key={item.userId} item={item} onButtonClick={props.onSearchItemButtonClick}/>
    ));

    return (
      <div className="ui">
        <Navigation/>
        <div className="page-wrapper">
          <div className="page">
            <div className="grid-container">
              <div className="grid-column col-60">
                <div className="substrate">
                  <div className="textbox icon"><i className="fa fa-search"/>
                    <input
                      type="text"
                      placeholder="Enter your user name ..."
                      onInput={this.onQueryInput}
                    />
                  </div>
                  <div className="list-of-users">
                    <ul>
                      {searchItemsHtml}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private onQueryInput(event: React.FormEvent<HTMLInputElement>) {
    this.props.onQueryInput((event.target as HTMLInputElement).value);
  }
}

export default SearchPage;
