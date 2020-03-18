import React, { useRef, useState } from 'react';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import Logo from '../../components/Logo';
import Input from '../../components/Input';
import { Container, FormContainer, SubmitButton } from './styles';

export default function SignIn() {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit({ email, password }) {
    try {
      formRef.current.setErrors({});

      const schema = Yup.object().shape({
        email: Yup.string()
          .email('Insira um e-mail válido')
          .required('O e-mail é obrigatório'),
        password: Yup.string().required('A senha é obrigatória'),
      });

      await schema.validate(
        { email, password },
        {
          abortEarly: false,
        }
      );

      setLoading(true);

      console.tron.log({ email, password });
    } catch (err) {
      const validationErrors = {};
      if (err instanceof Yup.ValidationError) {
        err.inner.forEach(error => {
          validationErrors[error.path] = error.message;
        });

        formRef.current.setErrors(validationErrors);
      }
    }
  }

  return (
    <Container>
      <FormContainer>
        <Logo />
        <Form ref={formRef} onSubmit={handleSubmit} noValidate>
          <Input
            name="email"
            label="Seu e-mail"
            placeholder="email@example.com"
            type="email"
          />
          <Input
            name="password"
            label="Sua senha"
            placeholder="*******"
            type="password"
          />

          <SubmitButton loading={loading} type="submit">
            Entrar no sistema
          </SubmitButton>
        </Form>
      </FormContainer>
    </Container>
  );
}
