import * as React from 'react';

export default function SignupForm() {
  return(
    <>
      <h1>
        Signup Form
      </h1>
      {/* <p>
      Build a user Signup form in React with the following features. 
      </p>

      <ol>
        <li>An email and a password input</li>
        <li>Email must have an “@” and the domain side must include a “.”</li>
        <li>Password must include
          <ol>
            <li>At least one special character</li>
            <li>one number and be at least 8 characters</li>
          </ol>
        </li>
        <li>Validation and error handling
          <ol>
            <li>Client-side validations</li>
            <li>Server side errors</li>
          </ol>
        </li>
        <li>Basic aesthetics with pure CSS</li>
      </ol> */}
      <SignUp />
    </>
  )
}

// Mock server call?
function submit(email) {
  if (email.includes('error')) {
    return Promise.reject(new Error('Invalid User'))
  }

  return Promise.resolve('Success!')
}

// Start 22.05
// End 22.40
function SignUp() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [signUpError, setSignUpError] = React.useState(null);

  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitted(true);
    
    if (!emailError && !passwordError) {
      try {
        await submit(email, password);
        alert('Success!')
      } catch(e) {
        setSignUpError(e.message);
      }
    }
  }

  return (
    <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>
      <label>
        <div>
          Email: <input name="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        {emailError && isSubmitted && <div style={{ color: 'tomato' }}>{emailError}</div>}
      </label>
      <label>
        Password: <input name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        {passwordError && isSubmitted && <div style={{ color: 'tomato' }}>{passwordError}</div>}
      </label>
      <button type="submit" style={{ width: 'fit-content' }}>Submit</button>
      {signUpError && <div style={{ color: 'tomato' }}>Error signing up: {signUpError}</div>}
    </form>
  );
}

function validateEmail(email) {
  if (!email) {
    return 'Email is required';
  }

  const emailParts = email.split('@');

  if (emailParts.length < 2) {
    return 'Email is missing a host';
  }

  if (emailParts.length > 2) {
    return 'Invalid email address (more than one @ found)'
  }

  const [handle, host] = emailParts;

  if (handle === '') {
    return 'Invalid email handle'
  }

  if (host === '') {
    return 'Invalid host'
  }

  if (host[0] === '.') {
    return 'Host can\'t start with a dot (.)'
  }

  if (host[host.length - 1] === '.') {
    return 'Host can\'t end with a dot (.)'
  }

  if (!host.includes('.')) {
    return 'Host must include a dot (.)'
  }

  return null;
}

function validatePassword(password) {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters'
  }

  const [aCode, zCode, ACode, ZCode, ZeroCode, NineCode] = 'azAZ09'.split('').map(c => c.charCodeAt(0))

  const passwordCharCodes = password.split('').map(c => c.charCodeAt(0))

  const includesSpecialChar = passwordCharCodes.some(c => (
    (c < aCode || c > zCode) &&
    (c < ACode || c > ZCode) &&
    (c < ZeroCode || c > NineCode)
  ));

  if (!includesSpecialChar) {
    return 'Password must include special characters'
  }

  const includesNumber = passwordCharCodes.some(c => (
    c >= ZeroCode && c <= NineCode
  ));

  if (!includesNumber) {
    return 'Password must include a number'
  }

  return null;
}
