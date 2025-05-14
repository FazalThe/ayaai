'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, MapPin } from 'lucide-react';

export default function PrayerTimes() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        
        try {
          const res = await fetch(`/api/prayer-times?lat=${latitude}&lng=${longitude}`);
          const data = await res.json();
          
          if (!res.ok) throw new Error(data.error || 'Failed to fetch prayer times');
          
          setPrayerTimes(data);
          setLoading(false);
        } catch (err: any) {
          setError(err.message);
          setLoading(false);
        }
      },
      (err) => {
        setError('Location permission denied');
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex flex-col items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
          <p className="text-sm text-muted-foreground">Detecting location...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <Alert variant="destructive" className="mb-4">
          <AlertDescription className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            {error}
          </AlertDescription>
        </Alert>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-white">
        <CardTitle className="text-xl font-bold">Today's Prayer Times</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {Object.entries(prayerTimes.timings).map(([name, time]) => (
            <div 
              key={name} 
              className="flex justify-between items-center p-3 rounded-lg bg-muted/50"
            >
              <span className="font-medium">{name}</span>
              <span className="text-lg font-bold">{time as string}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}