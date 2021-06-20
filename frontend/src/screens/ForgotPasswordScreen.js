import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { FormContainer } from '../components/FormContainer'
import {
  checkIfExistingEmail,
  sendPasswordResetEmail,
} from '../actions/userActions'
import { USER_CHECK_EMAIL_EXISTING_RESET } from '../constants/userConstants'

const ForgotPasswordScreen = () => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const checkExistingEmail = useSelector((state) => state.checkExistingEmail)
  const { error, existingEmail, loading } = checkExistingEmail

  useEffect(() => {
    if (existingEmail) {
      setMessage('Reset email sent successfully!')
      setEmail('')
    }
  }, [existingEmail, message])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch({ type: USER_CHECK_EMAIL_EXISTING_RESET })
    setMessage('')
    if (email === '') {
      setMessage('Enter an email')
    } else if (email) {
      dispatch(checkIfExistingEmail(email))
      console.log(error)
      if (!error) {
        dispatch(sendPasswordResetEmail(email))
      }
    }
  }

  return (
    <FormContainer>
      <h1>Forgot Password</h1>
      {loading && <Loader></Loader>}
      {error && <Message variant='danger'>{error}</Message>}
      {message !== '' && message === 'Enter an email' && (
        <Message variant='info'>{message}</Message>
      )}
      {message !== '' && message === 'Reset email sent successfully!' && (
        <Message variant='success'>{message}</Message>
      )}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email'>
          <Form.Label>Enter email address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Button variant='primary' type='submit'>
          Send reset link
        </Button>
      </Form>
    </FormContainer>
  )
}

export default ForgotPasswordScreen
