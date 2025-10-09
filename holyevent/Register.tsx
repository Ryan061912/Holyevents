"use client"

import type React from "react"
import { useState } from "react"
import styled from "styled-components"
import { Church, Eye, EyeOff, CheckCircle2, AlertCircle, Mail } from "lucide-react"
import Link from "next/link"

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f8fafc 100%);
`

const StyledCard = styled.div`
  width: 100%;
  max-width: 28rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid #e2e8f0;
`

const CardHeader = styled.div`
  padding: 1.5rem;
  text-align: center;
  padding-bottom: 1.5rem;
`

const IconContainer = styled.div`
  margin: 0 auto;
  width: 4rem;
  height: 4rem;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`

const CardTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 0.5rem;
  color: #1f2937;
`

const CardDescription = styled.p`
  font-size: 1rem;
  color: #6b7280;
  line-height: 1.5;
`

const CardContent = styled.div`
  padding: 1.5rem;
`

const Alert = styled.div<{ variant?: 'destructive' | 'success' }>`
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  background: ${props => 
    props.variant === 'destructive' ? '#fef2f2' : 
    props.variant === 'success' ? '#f0fdf4' : '#eff6ff'};
  border: 1px solid ${props => 
    props.variant === 'destructive' ? '#fecaca' : 
    props.variant === 'success' ? '#bbf7d0' : '#dbeafe'};
`

const AlertDescription = styled.p<{ variant?: 'destructive' | 'success' }>`
  font-size: 0.875rem;
  color: ${props => 
    props.variant === 'destructive' ? '#dc2626' : 
    props.variant === 'success' ? '#16a34a' : '#1d4ed8'};
  font-weight: 500;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.hasError ? '#ef4444' : '#d1d5db'};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#ef4444' : '#3b82f6'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
  }

  &::placeholder {
    color: #9ca3af;
  }
`

const OTPContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
`

const OTPInput = styled.input<{ hasError?: boolean }>`
  width: 3.5rem;
  height: 3.5rem;
  border: 2px solid ${props => props.hasError ? '#ef4444' : '#d1d5db'};
  border-radius: 0.5rem;
  text-align: center;
  font-size: 1.25rem;
  font-weight: 600;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`

const InputContainer = styled.div`
  position: relative;
`

const ToggleButton = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
  padding: 0.25rem;

  &:hover {
    color: #374151;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const ErrorText = styled.p`
  font-size: 0.875rem;
  color: #ef4444;
`

const SuccessText = styled.p`
  font-size: 0.875rem;
  color: #16a34a;
  font-weight: 500;
`

const ResendButton = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 0.875rem;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;

  &:hover {
    color: #2563eb;
  }

  &:disabled {
    color: #9ca3af;
    cursor: not-allowed;
    text-decoration: none;
  }
`

const SubmitButton = styled.button<{ disabled?: boolean }>`
  width: 100%;
  height: 2.75rem;
  background: ${props => props.disabled ? '#9ca3af' : '#3b82f6'};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.disabled ? '#9ca3af' : '#2563eb'};
  }
`

const LoginText = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
  padding-top: 0.5rem;
`

const LoginLink = styled(Link)`
  font-weight: 600;
  color: #3b82f6;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`

const Step = styled.div<{ active?: boolean; completed?: boolean }>`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background: ${props => 
    props.active ? '#3b82f6' : 
    props.completed ? '#10b981' : '#d1d5db'};
  transition: background-color 0.2s;
`

const VerificationSent = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
`

const EmailIcon = styled.div`
  width: 3rem;
  height: 3rem;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
`

export default function RegisterPage() {
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // OTP State
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [otpError, setOtpError] = useState("")
  const [resendCooldown, setResendCooldown] = useState(0)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters"
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Send OTP using Brevo
  const sendOTP = async () => {
  try {
    setIsSubmitting(true)
    setOtpError("")

    console.log('Sending OTP to:', formData.email) // Debug log

    const response = await fetch('/api/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName
      }),
    })

    const data = await response.json()
    console.log('Response:', response.status, data) // Debug log

    if (response.ok) {
      setIsOtpSent(true)
      startResendCooldown()
    } else {
      console.error('Failed to send OTP:', data) // Debug log
      setErrors({ submit: data.error || 'Failed to send OTP' })
    }
  } catch (error) {
    console.error('Catch error:', error) // Debug log
    setErrors({ submit: 'Failed to send OTP. Please try again.' })
  } finally {
    setIsSubmitting(false)
  }
}

  const startResendCooldown = () => {
    setResendCooldown(30)
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleResendOTP = () => {
    if (resendCooldown === 0) {
      sendOTP()
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        if (nextInput) nextInput.focus()
      }
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const verifyOTP = async () => {
    const otpString = otp.join('')
    if (otpString.length !== 6) {
      setOtpError('Please enter the 6-digit OTP')
      return
    }

    try {
      setIsVerifying(true)
      setOtpError("")

      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp: otpString
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsVerified(true)
        // Complete registration
        await completeRegistration()
      } else {
        setOtpError(data.error || 'Invalid OTP code')
      }
    } catch (error) {
      setOtpError('Failed to verify OTP. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  const completeRegistration = async () => {
    try {
      // Save user to database
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to create account')
      }

      // Registration successful
      console.log("Account created successfully:", formData)
    } catch (error) {
      setErrors({ submit: 'Failed to create account. Please try again.' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    // If OTP not sent yet, send OTP
    if (!isOtpSent) {
      await sendOTP()
    } else if (!isVerified) {
      // If OTP sent but not verified, verify OTP
      await verifyOTP()
    }
  }

  return (
    <Container>
      <StyledCard>
        <CardHeader>
          <IconContainer>
            <Church size={32} color="#3b82f6" />
          </IconContainer>
          <CardTitle>
            {isVerified ? "Welcome!" : 
             isOtpSent ? "Verify Your Email" : 
             "Join Our Community"}
          </CardTitle>
          <CardDescription>
            {isVerified ? "Your account has been created successfully!" :
             isOtpSent ? `We sent a verification code to ${formData.email}` :
             "Create your account to connect with our church family"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <StepIndicator>
            <Step completed={isOtpSent || isVerified} />
            <Step active={isOtpSent && !isVerified} completed={isVerified} />
            <Step active={isVerified} />
          </StepIndicator>

          {errors.submit && (
            <Alert variant="destructive">
              <AlertCircle size={20} color="#ef4444" />
              <AlertDescription variant="destructive">
                {errors.submit}
              </AlertDescription>
            </Alert>
          )}

          {isVerified && (
            <Alert variant="success">
              <CheckCircle2 size={20} color="#16a34a" />
              <AlertDescription variant="success">
                Account verified successfully! Welcome to our community.
              </AlertDescription>
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {!isOtpSent ? (
              // Registration Form
              <>
                <FormGrid>
                  <FormGroup>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      hasError={!!errors.firstName}
                      placeholder="John"
                    />
                    {errors.firstName && <ErrorText>{errors.firstName}</ErrorText>}
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      hasError={!!errors.lastName}
                      placeholder="Doe"
                    />
                    {errors.lastName && <ErrorText>{errors.lastName}</ErrorText>}
                  </FormGroup>
                </FormGrid>

                <FormGroup>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    hasError={!!errors.email}
                    placeholder="john.doe@example.com"
                  />
                  {errors.email && <ErrorText>{errors.email}</ErrorText>}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="password">Password</Label>
                  <InputContainer>
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      hasError={!!errors.password}
                      placeholder="••••••••"
                    />
                    <ToggleButton
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </ToggleButton>
                  </InputContainer>
                  {errors.password && <ErrorText>{errors.password}</ErrorText>}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <InputContainer>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      hasError={!!errors.confirmPassword}
                      placeholder="••••••••"
                    />
                    <ToggleButton
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </ToggleButton>
                  </InputContainer>
                  {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
                </FormGroup>
              </>
            ) : !isVerified ? (
              // OTP Verification Form
              <>
                <VerificationSent>
                  <EmailIcon>
                    <Mail size={20} color="#3b82f6" />
                  </EmailIcon>
                  <p>We've sent a 6-digit verification code to your email address.</p>
                  <SuccessText>Please check your inbox and enter the code below.</SuccessText>
                </VerificationSent>

                <FormGroup>
                  <Label>Verification Code</Label>
                  <OTPContainer>
                    {otp.map((digit, index) => (
                      <OTPInput
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        hasError={!!otpError}
                        autoFocus={index === 0}
                      />
                    ))}
                  </OTPContainer>
                  {otpError && <ErrorText>{otpError}</ErrorText>}
                  
                  <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                      Didn't receive the code?{' '}
                      <ResendButton 
                        onClick={handleResendOTP} 
                        disabled={resendCooldown > 0}
                      >
                        Resend {resendCooldown > 0 && `(${resendCooldown}s)`}
                      </ResendButton>
                    </p>
                  </div>
                </FormGroup>
              </>
            ) : (
              // Success Message
              <VerificationSent>
                <EmailIcon>
                  <CheckCircle2 size={20} color="#16a34a" />
                </EmailIcon>
                <h3 style={{ color: '#16a34a', marginBottom: '0.5rem' }}>Registration Complete!</h3>
                <p>Your account has been successfully created and verified.</p>
                <SuccessText>You can now sign in to your account.</SuccessText>
              </VerificationSent>
            )}

            {!isVerified && (
              <SubmitButton 
                type="submit" 
                disabled={isSubmitting || isVerifying}
              >
                {isSubmitting || isVerifying ? (
                  <>
                    <span style={{ animation: 'spin 1s linear infinite', marginRight: '0.5rem' }}>⏳</span>
                    {isVerifying ? 'Verifying...' : 'Sending OTP...'}
                  </>
                ) : isOtpSent ? (
                  'Verify Account'
                ) : (
                  'Send Verification Code'
                )}
              </SubmitButton>
            )}

            {isVerified && (
              <SubmitButton 
                type="button"
                onClick={() => window.location.href = '/login'}
              >
                Go to Sign In
              </SubmitButton>
            )}

            {!isOtpSent && !isVerified && (
              <LoginText>
                Already have an account?{" "}
                <LoginLink href="/login">
                  Sign in
                </LoginLink>
              </LoginText>
            )}
          </Form>
        </CardContent>
      </StyledCard>
    </Container>
  )
}