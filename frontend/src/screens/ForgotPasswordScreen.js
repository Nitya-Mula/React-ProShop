import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { FormContainer } from '../components/FormContainer'

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('')

  const submitHandler = (e) => {
    e.preventDefault()
    console.log('Send link')
  }

  return (
    <FormContainer>
      <h1>Forgot Password</h1>
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
