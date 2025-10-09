"use client"
import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { Calendar, Users, BookOpen, Heart } from "lucide-react";

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%);
`;

const Nav = styled.nav`
  border-bottom: 1px solid #e2e8f0;
  background: white;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .logo-icon {
    width: 2rem;
    height: 2rem;
    background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .logo-text {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
  }
`;

const NavButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'outline' | 'ghost'; size?: 'lg' | 'default' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.size === 'lg' ? '0.75rem 1.5rem' : '0.5rem 1rem'};
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: ${props => props.size === 'lg' ? '1rem' : '0.875rem'};
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
          color: white;
          &:hover {
            background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: #3b82f6;
          border: 1px solid #3b82f6;
          &:hover {
            background: #3b82f6;
            color: white;
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: #64748b;
          &:hover {
            background: #f1f5f9;
            color: #1e293b;
          }
        `;
      default:
        return `
          background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
          color: white;
          &:hover {
            background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
          }
        `;
    }
  }}
`;

const HeroSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 5rem 1rem;
  
  @media (min-width: 768px) {
    padding: 8rem 1rem;
  }
`;

const HeroContent = styled.div`
  max-width: 64rem;
  margin: 0 auto;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  
  @media (min-width: 768px) {
    font-size: 3.75rem;
  }
`;

const HeroDescription = styled.p`
  font-size: 1.125rem;
  color: #64748b;
  margin-bottom: 2rem;
  line-height: 1.6;
  max-width: 32rem;
  margin-left: auto;
  margin-right: auto;
  
  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  
  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: center;
  }
`;

const FeaturesSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 1rem;
  
  @media (min-width: 768px) {
    padding: 6rem 1rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const FeatureCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
`;

const FeatureIcon = styled.div`
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const CTASection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 1rem;
  
  @media (min-width: 768px) {
    padding: 6rem 1rem;
  }
`;

const CTACard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  
  @media (min-width: 768px) {
    padding: 3rem;
  }
`;

const CTATitle = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
  
  @media (min-width: 768px) {
    font-size: 2.25rem;
  }
`;

const CTADescription = styled.p`
  color: #64748b;
  margin-bottom: 2rem;
  max-width: 32rem;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const Footer = styled.footer`
  border-top: 1px solid #e2e8f0;
  margin-top: 4rem;
  background: white;
`;

const FooterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .footer-icon {
    width: 1.5rem;
    height: 1.5rem;
    background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
    border-radius: 0.375rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .footer-text {
    font-size: 0.875rem;
    color: #64748b;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const FooterLink = styled.a`
  font-size: 0.875rem;
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;
  
  &:hover {
    color: #1e293b;
  }
`;

export default function HomePage() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/login');
  };

  const handleSignUp = () => {
    router.push('/registerpage');
  };

  const handleGetStarted = () => {
    router.push('/registerpage');
  };

  const handleDashboard = () => {
    router.push('/login');
  };

  const handleCreateAccount = () => {
    router.push('/registerpage');
  };

  return (
    <Container>
      {/* Navigation */}
      <Nav>
        <NavContainer>
          <Logo>
            <div className="logo-icon">
              <Heart size={16} color="white" />
            </div>
            <span className="logo-text">Church Portal</span>
          </Logo>
          <NavButtons>
            <Button variant="ghost" onClick={handleSignIn}>
              Sign In
            </Button>
            <Button variant="primary" onClick={handleSignUp}>
              Sign Up
            </Button>
          </NavButtons>
        </NavContainer>
      </Nav>

      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroTitle>
            Welcome to Our Church Community
          </HeroTitle>
          <HeroDescription>
            Connect with our community, schedule appointments with pastoral staff, and stay updated with church events
            and resources.
          </HeroDescription>
          <HeroButtons>
            <Button size="lg" onClick={handleGetStarted}>
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={handleDashboard}>
              Sign In to Dashboard
            </Button>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      {/* Features Section */}
      <FeaturesSection>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>
              <Calendar size={24} color="#3b82f6" />
            </FeatureIcon>
            <FeatureTitle>Schedule Appointments</FeatureTitle>
            <FeatureDescription>
              Book meetings with pastoral staff, counseling sessions, or prayer appointments easily.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <Users size={24} color="#3b82f6" />
            </FeatureIcon>
            <FeatureTitle>Connect with Community</FeatureTitle>
            <FeatureDescription>
              Stay connected with fellow members and participate in church activities.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <BookOpen size={24} color="#3b82f6" />
            </FeatureIcon>
            <FeatureTitle>Access Resources</FeatureTitle>
            <FeatureDescription>
              Browse sermons, devotionals, and other spiritual resources anytime.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <Heart size={24} color="#3b82f6" />
            </FeatureIcon>
            <FeatureTitle>Grow in Faith</FeatureTitle>
            <FeatureDescription>
              Join small groups, Bible studies, and other opportunities for spiritual growth.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      {/* CTA Section */}
      <CTASection>
        <CTACard>
          <CTATitle>Join Our Community Today</CTATitle>
          <CTADescription>
            Create your account to access all features and stay connected with our church family.
          </CTADescription>
          <Button size="lg" onClick={handleCreateAccount}>
            Create Your Account
          </Button>
        </CTACard>
      </CTASection>

      {/* Footer */}
      <Footer>
        <FooterContainer>
          <FooterContent>
            <FooterLogo>
              <div className="footer-icon">
                <Heart size={12} color="white" />
              </div>
              <span className="footer-text">© 2025 Church Portal. All rights reserved.</span>
            </FooterLogo>
            <FooterLinks>
              <FooterLink href="#" onClick={(e) => { e.preventDefault(); /* Add navigation */ }}>
                About
              </FooterLink>
              <FooterLink href="#" onClick={(e) => { e.preventDefault(); /* Add navigation */ }}>
                Contact
              </FooterLink>
              <FooterLink href="#" onClick={(e) => { e.preventDefault(); /* Add navigation */ }}>
                Privacy
              </FooterLink>
            </FooterLinks>
          </FooterContent>
        </FooterContainer>
      </Footer>
    </Container>
  );
}