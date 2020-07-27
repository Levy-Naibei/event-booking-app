import React, { Component } from 'react';
import Modal from '../components/modal/Modal';
import Backdrop from '../components/backdrop/Backdrop';
import AuthContext from '../Context';
import './event.css';
import EventList from '../components/event/EventList';
import Spinner from '../components/spinner/Spinner';

class Event extends Component {
  state = {
    creating: false,
    events: [],
    isLoading: false,
    selectedEvent: null
  };

  isActive = true;

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  componentDidMount() {
    this.fetchEvents();
  }

  handleCreateEvent = () => {
    this.setState({ creating: true });
  };

  handleModalCancel = () => {
    this.setState({ creating: false, selectedEvent: null });
  };

  handleModalSend = () => {
    const token = this.context.token;
    this.setState({ creating: false });
    const title = this.titleElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const event = { title, price, date, description };
    console.log(event);

    const requestBody = {
      query: `
        mutation {
          createEvent(eventInput: {
            title: "${title}",
            description: "${description}",
            price: ${price},
            date: "${date}"}) {
              title
              description
              price
              date
          }
        }
      `
    };

    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(res => {
        this.setState(prevState => {
            const updatedEvents = [...prevState.events];
            updatedEvents.push({
              _id: res.data.createEvent._id,
              title: res.data.createEvent.title,
              description: res.data.createEvent.description,
              price: res.data.createEvent.price,
              date: res.data.createEvent.date,
              creator: {
                _id: this.context.userId
            }
          });
          console.log(updatedEvents);
          return {events: updatedEvents};
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  fetchEvents() {
    this.setState({ isLoading: true});
    const requestBody = {
      query: `
          query {
            events {
              title
              description
              date
              price
              creator {
                _id
              }
            }
          }
        `
    };

    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        console.log(res);
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(res => {
        const events = res.data.events;
        this.setState({ events: events, isLoading: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({isLoading: false});
      });
  }

  handleViewDetail = eventId => {
    this.setState(prevState => {
      const selectedEvent = prevState.events.find(e => e._id === eventId);
      return {selectedEvent: selectedEvent};
    });
  }

  handleBookEvent = () => {
    if(!this.context.token){
      this.setState({selectedEvent: null});
      return;
    }

    const requestBody = {
      query: `
        mutation {
          bookEvent(eventId: "${this.state.selectedEvent._id}") {
            _id
            createdAt
            updatedAt
          }
        }
      `
    };

    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
    .then(res => {
      console.log(res);
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(res => {
      console.log(res);
      this.setState({selectedEvent: null});
    })
    .catch(err => {
      console.log(err);
    });
  }

  // stop http request when you navigate to different component 
  componentWillUnmount(){
    this.isActive = false;
  }

  render() {
    const {events, creating, isLoading, selectedEvent} = this.state;

    return (
      <React.Fragment>
        {(creating || selectedEvent) &&  <Backdrop />}
        {creating && (
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onCancel={this.handleModalCancel}
            onConfirm={this.handleModalSend}
            confirmText='Send'
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={this.titleElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" ref={this.priceElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input type="datetime-local" id="date" ref={this.dateElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows="4"
                  ref={this.descriptionElRef}
                />
              </div>
            </form>
          </Modal>
        )}
        
        {selectedEvent && (
          <Modal
            title={selectedEvent.title}
            canCancel
            canConfirm
            onCancel={this.handleModalCancel}
            onConfirm={this.handleBookEvent}
            confirmText={this.context.token? 'Book':'Confirm' }>
            <div>
              <h1>{selectedEvent.title}</h1>
              <h3 className='event_price-date'>
                  ${selectedEvent.price} &#124; {selectedEvent.date}
              </h3>
              <h3> {selectedEvent.description}</h3>
            </div>
          </Modal>
        )}

        {this.context.token && (
          <div className="events-control">
            <p>Share Events Here!</p>
            <button className="btn" onClick={this.handleCreateEvent}>
              Create Event
            </button>
          </div>
        )}

        {isLoading? <Spinner />
          : <EventList
            events={events}
            authUserId={this.context.userId}
            onViewDetail={this.handleViewDetail}
          />
        }
      </React.Fragment>
    );
  }
}

export default Event;