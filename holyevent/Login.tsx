"use client";
import React, { useState, FormEvent } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './../firebaseconfig';
import { Eye, EyeOff, Church, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

// Define the Firebase error type
interface FirebaseError {
  code: string;
  message: string;
}

// Type guard to check if error is a FirebaseError
function isFirebaseError(error: unknown): error is FirebaseError {
  return typeof error === 'object' && error !== null && 'code' in error;
}

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

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
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
    opacity: 0.7;
    cursor: not-allowed;
  }
`

const ErrorText = styled.p`
  font-size: 0.875rem;
  color: #ef4444;
`

const RememberForgot = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  margin: -0.5rem 0;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
`

const RememberLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #374151;
  cursor: pointer;

  input[type="checkbox"] {
    accent-color: #3b82f6;
    cursor: pointer;
  }

  &:has(input:disabled) {
    opacity: 0.7;
    cursor: not-allowed;
  }
`

const ForgotLink = styled(Link)`
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: #2563eb;
    text-decoration: underline;
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
    transform: ${props => props.disabled ? 'none' : 'translateY(-1px)'};
    box-shadow: ${props => props.disabled ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.3)'};
  }
`

const RegisterText = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
  padding-top: 0.5rem;
`

const RegisterLink = styled(Link)`
  font-weight: 600;
  color: #3b82f6;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    color: #2563eb;
  }
`

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setLoginSuccess(false);
    
    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }
    
    try {
      console.log('Attempting to sign in with:', email);
      
      // Authenticate with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('Authentication successful, user UID:', user.uid);
      setLoginSuccess(true);
      
      // Get user role from Firestore - with error handling for permissions
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userRole = userData.role || 'user'; // Default to 'user' if role not set
          
          console.log('User role retrieved:', userRole);
          
          // Store user data if "Remember Me" is checked
          if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
            localStorage.setItem('user', JSON.stringify({
              uid: user.uid,
              email: user.email,
              role: userRole
            }));
          } else {
            sessionStorage.setItem('user', JSON.stringify({
              uid: user.uid,
              email: user.email,
              role: userRole
            }));
          }
          
          // Redirect based on role
          setTimeout(() => {
            if (userRole === 'admin') {
              router.push('/AdminDashboard');
            } else {
              router.push('/Dashboard');
            }
          }, 1000);
        } else {
          console.error('User document not found in Firestore for UID:', user.uid);
          setError('User data not found. Please contact support.');
          setLoginSuccess(false);
        }
      } catch (firestoreError) {
        console.error('Firestore access error:', firestoreError);
        // If we can't access Firestore, proceed with default user role
        const userRole = 'user';
        
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('user', JSON.stringify({
            uid: user.uid,
            email: user.email,
            role: userRole
          }));
        } else {
          sessionStorage.setItem('user', JSON.stringify({
            uid: user.uid,
            email: user.email,
            role: userRole
          }));
        }
        
        setTimeout(() => {
          router.push('/Dashboard');
        }, 1000);
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginSuccess(false);
      
      if (isFirebaseError(err)) {
        switch (err.code) {
          case 'auth/invalid-email':
            setError('Invalid email address format.');
            break;
          case 'auth/user-disabled':
            setError('This account has been disabled.');
            break;
          case 'auth/user-not-found':
            setError('No account found with this email.');
            break;
          case 'auth/wrong-password':
            setError('Incorrect password.');
            break;
          case 'auth/invalid-credential':
            setError('Invalid email or password. Please check your credentials.');
            break;
          default:
            setError(`Authentication failed: ${err.message}`);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <StyledCard>
        <CardHeader>
          <IconContainer>
            <Church size={32} color="#3b82f6" />
          </IconContainer>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loginSuccess && (
            <Alert variant="success">
              <CheckCircle2 size={20} color="#16a34a" />
              <AlertDescription variant="success">
                Login successful! Redirecting...
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle size={20} color="#dc2626" />
              <AlertDescription variant="destructive">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                hasError={!!error}
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <InputContainer>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  hasError={!!error}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <ToggleButton
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </ToggleButton>
              </InputContainer>
            </FormGroup>

            <RememberForgot>
              <RememberLabel>
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                Remember Me
              </RememberLabel>
              <ForgotLink href="/forgot-password">
                Forgot Password?
              </ForgotLink>
            </RememberForgot>

            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span style={{ animation: 'spin 1s linear infinite', marginRight: '0.5rem' }}>⏳</span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </SubmitButton>

            <RegisterText>
              Don't have an account?{" "}
              <RegisterLink href="/register">
                Create an account
              </RegisterLink>
            </RegisterText>
          </Form>
        </CardContent>
      </StyledCard>
    </Container>
  );
}

export default Login;