import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { FormContainer } from '../components/FormContainer'
import { resetPassword } from '../actions/userActions'

const ResetPasswordScreen = ({ match }) => {
  const dispatch = useDispatch()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  const passwordReset = useSelector((state) => state.passwordReset)
  const { error, loading, success } = passwordReset

  useEffect(() => {}, [])

  const submitHandler = (e) => {
    e.preventDefault()
    setMessage('')
    if (password === '' || confirmPassword === '') {
      setMessage('Enter all fields')
    } else if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else {
      dispatch(resetPassword(password, match.params.token))
      setMessage('Password reset successful')
      setPassword('')
      setConfirmPassword('')
    }
  }

  return (
    <FormContainer>
      <h1>Reset Password</h1>
      {loading && <Loader></Loader>}
      {error && <Message variant='danger'>{error}</Message>}
      {message === 'Passwords do not match' && (
        <Message variant='danger'>{message}</Message>
      )}
      {message === 'Password reset successful' && (
        <Message variant='success'>{message}</Message>
      )}
      {message === 'Enter all fields' && (
        <Message variant='info'>{message}</Message>
      )}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='password'>
          <Form.Label>Enter new password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter new password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId='confirmPassword'>
          <Form.Label>Confirm password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant='primary' type='submit'>
          Reset Password
        </Button>
      </Form>
    </FormContainer>
  )
}

export default ResetPasswordScreen
