import { render, screen } from '@testing-library/react';
import { FormSelect } from '../formSelect';
import { SelectItem } from '../select';

describe('FormSelect', () => {
  it('renders label and select correctly', () => {
    render(
      <FormSelect 
        name="test-select" 
        label="Test Label"
        placeholder="Test placeholder"
      >
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
      </FormSelect>
    );

    // Check if label is rendered
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    
    // Check if select trigger is rendered with placeholder
    expect(screen.getByText('Test placeholder')).toBeInTheDocument();
  });

  it('shows required asterisk when required prop is true', () => {
    render(
      <FormSelect 
        name="required-select" 
        label="Required Field"
        required={true}
      >
        <SelectItem value="option1">Option 1</SelectItem>
      </FormSelect>
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    const errorMessage = 'This field is required';
    
    render(
      <FormSelect 
        name="error-select" 
        label="Error Field"
        error={errorMessage}
      >
        <SelectItem value="option1">Option 1</SelectItem>
      </FormSelect>
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('displays description when description prop is provided', () => {
    const description = 'This is a helpful description';
    
    render(
      <FormSelect 
        name="desc-select" 
        label="Field with Description"
        description={description}
      >
        <SelectItem value="option1">Option 1</SelectItem>
      </FormSelect>
    );

    expect(screen.getByText(description)).toBeInTheDocument();
  });
});