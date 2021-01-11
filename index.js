
/**
 * Enter your SendBird information here
 */
const APP_ID = '';          // SendBird Application ID
const DESK_API_KEY = '';    // Desk Application ID
const USER_ID = 'test1';    // Valid organization User ID


/**
 * Check user name and surname
 */
const userInfo = checkUserLoggedIn();
if (userInfo.name) {
    document.getElementById('name').value = userInfo.name
    if (userInfo.surname) {
        document.getElementById('surname').value = userInfo.surname
    }
}

/**
 * Only for demo purposes, we will store user's 
 * name and last name in localStorage.
 */
function checkUserLoggedIn() {
    const name = localStorage.getItem('name');
    const surname = localStorage.getItem('surname');
    return {
        name,
        surname
    }
}

/**
 * Init Sendbird SDK and Desk SDK
 */
function connectToDesk(callback) {
    const sb = new SendBird({ appId: APP_ID });
    sb.connect(USER_ID, (res, err) => {
        if (err) {
            console.dir(err);
            alert('Error connecting to SendBird Chat!');
            callback(false);
        } else {
            SendBirdDesk.init(SendBird);
            SendBirdDesk.authenticate(USER_ID, (res, err) => {
                if (err) {
                    console.dir(err);
                    alert('Error connecting to SendBird Desk!');
                    callback(false);
                } else {
                    callback(true);
                }
            });    
        }
    });
}

function createTicketSdk() {
    /**
     * Validate name and surname
     */
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    if (!name || !surname) {
        alert('Please enter a name and surname');
        return;
    }
    localStorage.setItem('name', name);
    localStorage.setItem('surname', surname);
    /**
     * Validate ticket title and message
     */
    const title = document.getElementById('title').value;
    const message = document.getElementById('message').value;
    if (!title || !message) {
        alert('Please enter a ticket name and message');
        return;
    }
    /**
     * Connect
     */
    connectToDesk((success) => {
        if (!success) {
            alert('You are not authenticated with Desk!');
            return;    
        }
        /**
         * Create ticket and send message
         */
        SendBirdDesk.Ticket.create(
            title,              /** TICKET TITLE */
            USER_ID,            /** USER ID CREATING THIS TICKET */
            "group-web-app",    /** GROUP KEY (configure this from your Dashboard) */
            {                   /** TICKET FIELDS */
                name,
                surname
            }, 
            (ticket, err) => {  /** CALLBACK RESPONSE */
                if (err) {
                    console.dir(err);
                    console.log('Unable to create this ticket! Check this browser console to see the error.');
                }
                /**
                 * Ticket is created with groupKey 'group-web-app' and customFields added.
                 */
                console.log(ticket);
                /**
                 * Send message
                 */
                ticket.channel.sendUserMessage(message, (message, error) => {
                    console.dir(message);
                    console.dir(error);
                    alert('TICKET CREATED. CHECK YOUR DASHBOARD!');
                })
            }
        );        
    })
}

