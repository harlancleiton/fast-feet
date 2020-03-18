import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import Logo from '../../components/Logo';
import Input from '../../components/Input';
import { Container, FormContainer, SubmitButton } from './styles';
import { signInRequest } from '../../store/modules/auth/actions';

export default function SignIn() {
  const dispatch = useDispatch();
  const loading = useSelector(store => store.auth.loading);
  const formRef = useRef(null);

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

      dispatch(signInRequest(email, password));
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
