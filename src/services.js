export function fetchLogin(username) {
    return fetch('/api/v1/session/', {
      method: 'POST',
      headers: {
        'content-type': 'application/json', 
      },
      body: JSON.stringify( { username } ),
    })
    .catch( err => Promise.reject({ error: 'network-error' }) )
    .then( response => {
      if(!response.ok) { 
        return response.json().then( err => Promise.reject(err) );
      }
      return response.json();
    });
  }


export function fetchSessionStatus() {
    return fetch('/api/v1/session/', {
      method: 'GET',
    })
    .catch(err => Promise.reject({ error: 'network-error' }))
    .then(response => {
      if(!response.ok) {
        return response.json().then(err => Promise.reject({ error: 'no-session' }));
      }
      return response.json();
    });
}

export function fetchChat() {
    return fetch('/api/v1/chat', {
      method: 'GET',
      credentials: 'include',
    })
    .catch(err => Promise.reject({ error: 'network-error' }))
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => Promise.reject(err));
      }
      return response.json();
    });
}

export function fetchSendMessage(message) {
    return fetch('/api/v1/message', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    })
    .catch(err => Promise.reject({ error: 'network-error' }))
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => Promise.reject(err));
      }
      return response.json();
    });
  }

export function fetchLogout() {
    return fetch('/api/v1/session/', {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .catch(err => Promise.reject({ error: 'network-error' }))
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => Promise.reject(err));
      }
      return response.json();
    });
}