import { useState, useEffect } from 'react';
import { fetchContent, type Hero, type Services, type Marquee, type Portfolio, type Contact, type Navigation } from '@/lib/client-data';

import heroData from '../../data/hero.json';
import servicesData from '../../data/services.json';
import marqueeData from '../../data/marquee.json';
import portfolioData from '../../data/portfolio.json';
import contactData from '../../data/contact.json';
import navigationData from '../../data/navigation.json';

export function useHero() {
  const [data, setData] = useState<Hero | null>(heroData as unknown as Hero);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchContent<Hero>('hero')
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useServices() {
  const [data, setData] = useState<Services | null>(servicesData as unknown as Services);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchContent<Services>('services')
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useMarquee() {
  const [data, setData] = useState<Marquee | null>(marqueeData as unknown as Marquee);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchContent<Marquee>('marquee')
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function usePortfolio() {
  const [data, setData] = useState<Portfolio | null>(portfolioData as unknown as Portfolio);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchContent<Portfolio>('portfolio')
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useContact() {
  const [data, setData] = useState<Contact | null>(contactData as unknown as Contact);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchContent<Contact>('contact')
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useNavigation() {
  const [data, setData] = useState<Navigation | null>(navigationData as unknown as Navigation);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchContent<Navigation>('navigation')
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
