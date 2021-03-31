import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Form } from 'react-bootstrap';
import { useHistory } from 'react-router';
import NavbarComponent from '../Navbar/Navbar.js';
import Popup from '../Popup/Popup.js';
import Cookies from 'js-cookie';

const PostCreator = (props) => {
	const history = useHistory();
	const [popup, setPopup] = useState({});

	async function handleClick (e) {
		e.preventDefault();
		const formElement = e.currentTarget;
		const formData = new FormData(formElement);
		const title = formData.get('title');
		const body = formData.get('body');
		const res = await fetch('/api/v1/posts', {
			'headers': {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${Cookies.get('token')}`
			},
			'method': 'POST',
			'body': JSON.stringify({
				title,
				body
			})
		});
		if (res.status === 200) {
			const result = await res.json();
			history.push(`/posts/${result}`);
		}
		if (res.status === 401) {
			setPopup({ 'message': 'Invalid credentials. Please login again.' });
		}
	}
	return (
		<>
			<NavbarComponent/>
			{ popup.message && <Popup error message={popup.message}/> }
			<div style={{ 'margin-left': '20%', 'margin-right': '20%', 'margin-top': '2%', 'padding': '2em' }} className='card'>
				<Form id='addPostForm' onSubmit={handleClick}>
					<div className='form-group'>
						<label>Title</label>
						<Form.Control name='title' className='form-control' id='title' placeholder='Enter title'/>
					</div>
					<div className='form-group'>
						<label>Body</label>
						<Form.Control name='body' className='form-control' id='body' placeholder='Enter text'/>
					</div>
					<button type='submit' className='btn btn-primary'>Submit</button>
				</Form>
			</div>
		</>
	);
};

export default PostCreator;
