var countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua & Deps",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia"
];

var KEYS = {
        BACKSPACE: 8,
        TAB: 9,
        ENTER: 13,
        ESCAPE: 27,
        ARROW_UP: 38,
        ARROW_DOWN: 40
    };

var Dropdown = React.createClass({
    getInitialState: function() {
        return { focusedItem: null };
    },

    onItemMouseOut: function(event) {
        this.setState({ focusedItem: null });
    },

    onItemMouseOver: function(event) {
        this.setState({focusedItem: event.target.innerText})
    },

    onItemClicked: function(event) {
        this.props.onItemSelected(event.target.innerText);
    },

    keyPressedOnEntryBox: function(keyCode) {
        switch (keyCode) {
            case KEYS.ARROW_UP:
                this.hoverPrevious();
            break;
            case KEYS.ARROW_DOWN:
                this.hoverNext();
            break;
            case KEYS.ENTER:
                if (this.state.focusedItem != null) {
                    this.props.onItemSelected(this.state.focusedItem);
                }
            break;
        }
    },

    hoverNext: function() {
        var indexOfCurrent = this.props.data.indexOf(this.state.focusedItem);
        var newIndex = indexOfCurrent < this.props.data.length - 1 ? indexOfCurrent + 1 : this.props.data.length - 1;
        this.hover(newIndex);
    },

    hoverPrevious: function() {
      var indexOfCurrent = this.props.data.indexOf(this.state.focusedItem);
      var newIndex = indexOfCurrent > 0 ? indexOfCurrent - 1 : 0;
      this.hover(newIndex);
    },

    hover: function(index) {
        this.setState({ focusedItem: this.props.data[index] });
    },

    render: function() {
        var that = this;
        var items = this.props.data.map(function(text) {
            return <li onClick={that.onItemClicked}
                       key={text}
                       className={that.state.focusedItem==text ? "hover" : ""}
                       onMouseOver={that.onItemMouseOver}
                       onMouseOut={that.onItemMouseOut}>{text}</li>;
        });

        // if the previously focused item is not in the list currently being shown, clear the focusedItem
        if (this.props.data.indexOf(this.state.focusedItem) === -1) {
            this.state.focusedItem = null;
        }

        return <ul>{items}</ul>;
    }
});

var EntryBox = React.createClass({
    getInitialState: function() {
        return { };
    },

    handleInputChange: function(event) {
        this.props.onTextChanged(event.target.value);
    },

    onKeyDown: function(event) {
        var keyCode = event.keyCode;
        if (keyCode === KEYS.ARROW_UP || keyCode === KEYS.ARROW_DOWN) {
            // stop the cursor from moving to the beginning or end of the textbox when arrow up/down is pressed
            event.preventDefault();
        }
        this.props.onKeyDown(event.keyCode);
    },

    render: function() {
        return (
            <div>
               <input onChange={this.handleInputChange}
                      onKeyDown={this.onKeyDown}
                      value={this.props.text} />
            </div>
        );
    }
});

var AutoCompleteBox = React.createClass({

    getInitialState: function() {
        return {
          visibleItems: countries, // items currently being shown in the list
          allItems: countries // all available items
        };
    },

    onTextChanged: function(text) {
        var filteredItems = this.state.allItems.filter(function(item) {
            return new RegExp(text, "gi").test(item);
        });
        var newState = {visibleItems: filteredItems, text: text};
        this.setState(newState);
    },

    onEntryBoxKeyDown: function(keyCode) {
        this.refs.dropdown.keyPressedOnEntryBox(keyCode);
    },

    onItemSelected: function(item) {
        console.log("item selected: " + item);
        this.setState({text: item});
    },

    render: function() {
        return (
            <div>
                <EntryBox text={this.state.text}
                          onTextChanged={this.onTextChanged}
                          onKeyDown={this.onEntryBoxKeyDown} />
                <Dropdown data={this.state.visibleItems}
                          onItemSelected={this.onItemSelected}
                          ref={'dropdown'}/>
            </div>
        );
    }
});

ReactDOM.render(
    <AutoCompleteBox />,
    document.getElementById('content')
);
