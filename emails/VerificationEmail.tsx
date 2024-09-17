import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
  Container,
} from '@react-email/components';
import { CSSProperties } from 'react';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here&apos;s your verification code: {otp}</Preview>
      <Container style={styles.container}>
        <Section style={styles.header}>
          <Heading as="h1" style={styles.headerText}>urFeedback</Heading>
        </Section>
        <Section style={styles.section}>
          <Row>
            <Heading as="h2" style={styles.heading}>Hello {username},</Heading>
          </Row>
          <Row>
            <Text style={styles.text}>
              Thank you for registering. Please use the following verification
              code to complete your registration:
            </Text>
          </Row>
          <Row>
            <Text style={styles.otp}>{otp}</Text>
          </Row>
          <Row>
            <Text style={styles.text}>
              If you did not request this code, please ignore this email.
            </Text>
          </Row>
          <Row>
            <Button
              href={`http://urfeedback.vercel.app/verify/${username}`}
              style={styles.button}
            >
              Verify here
            </Button>
          </Row>
          <Row>
            <Text style={styles.disclaimer}>
              Please note: This verification code is valid for 10 minutes. If you did not request this code, please ignore this email.
            </Text>
          </Row>
        </Section>
        <Section style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ by Himangshu Mishra
          </Text>
        </Section>
      </Container>
    </Html>
  );
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: 'Roboto, Verdana, sans-serif',
  },
  header: {
    backgroundColor: '#007bff',
    padding: '10px 20px',
    borderRadius: '8px 8px 0 0',
    textAlign: 'center' as 'center', // Explicitly cast to 'center'
  },
  headerText: {
    color: '#ffffff',
    margin: 0,
  },
  section: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '0 0 8px 8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    color: '#333333',
    marginBottom: '20px',
  },
  text: {
    color: '#555555',
    lineHeight: '1.5',
    marginBottom: '20px',
  },
  otp: {
    display: 'inline-block',
    backgroundColor: '#f0f0f0',
    padding: '10px 20px',
    borderRadius: '4px',
    fontSize: '18px',
    fontWeight: 'bold',
    letterSpacing: '2px',
    marginBottom: '20px',
  },
  button: {
    display: 'inline-block',
    backgroundColor: '#007bff',
    color: '#ffffff',
    padding: '10px 20px',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  disclaimer: {
    color: '#888888',
    fontSize: '12px',
    marginTop: '20px',
  },
  footer: {
    textAlign: 'center' as 'center',
    marginTop: '20px',
  },
  footerText: {
    color: '#888888',
    fontSize: '14px',
  },
};