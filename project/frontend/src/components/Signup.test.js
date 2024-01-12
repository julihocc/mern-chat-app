import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from '../reducer';  // Add your actual reducer
import Signup from './SignUp';

describe('Signup component', () => {
  let store;
  let component;

  beforeEach(() => {
    store = createStore(reducer);
    component = render(
      <Provider store={store}>
        <Signup />
      </Provider>
    );
  });

  it('should render signup form', () => {
    // verify elements rendered as expected
    expect(component.getByText('signup')).toBeInTheDocument();
    expect(component.getByLabelText('username')).toBeInTheDocument();
    expect(component.getByLabelText('email')).toBeInTheDocument();
    expect(component.getByLabelText('password')).toBeInTheDocument();
    expect(component.getByLabelText('confirmPassword')).toBeInTheDocument();
    expect(component.getByText('signup')).toBeInTheDocument();
  });

  it('should update the state when fields are changed', () => {
    fireEvent.change(component.getByLabelText('username'), { target: { value: 'newUser' } });
    fireEvent.change(component.getByLabelText('email'), { target: { value: 'test@example.com' } });
    fireEvent.change(component.getByLabelText('password'), { target: { value: 'testPwd' } });
    fireEvent.change(component.getByLabelText('confirmPassword'), { target: { value: 'testPwd' } });

    expect(component.getByLabelText('username').value).toBe('newUser');
    expect(component.getByLabelText('email').value).toBe('test@example.com');
    expect(component.getByLabelText('password').value).toBe('testPwd');
    expect(component.getByLabelText('confirmPassword').value).toBe('testPwd');     
  });

  // Write further similar tests, focusing on different behavior aspects...
});