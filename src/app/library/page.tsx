'use client';
import React, { useState } from 'react';

interface QuranVerse {
  verseId: string;
  verseNumber: number;
  verseText: string;
  surahName: string;
  surahNumber: number;
  translation: string;
  audioUrl?: string;
}

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [verses, setVerses] = useState<QuranVerse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Search surah by name
      const surahResponse = await fetch(`https://api.alquran.cloud/v1/surah/${searchQuery}`);
      const surahData = await surahResponse.json();
      
      if (surahData?.data) {
        // Get verses for this surah
        const versesResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahData.data.number}/en.asad`);
        const versesData = await versesResponse.json();
        
        if (versesData?.data?.ayahs) {
          const formattedVerses = versesData.data.ayahs
            .filter((verse: any) => verse.surah?.number && verse.number)
            .map((verse: any) => ({
              verseId: `${verse.surah.number}:${verse.number}`,
              verseNumber: verse.number,
              verseText: verse.text,
              surahName: surahData.data.name,
              surahNumber: surahData.data.number,
              translation: verse.translation,
              audioUrl: verse.audioSecondary?.[0]
            }));
          
          setVerses(formattedVerses);
        } else {
          setVerses([]);
          setError('No verses found in this surah.');
        }
      } else {
        // If surah not found, try direct verse search
        const verseResponse = await fetch(`https://api.alquran.cloud/v1/verse/${searchQuery}/en.asad`);
        const verseData = await verseResponse.json();
        
        if (verseData?.data) {
          // Check if surah data exists before accessing it
          if (verseData.data.surah?.number && verseData.data.number) {
            const formattedVerse = {
              verseId: `${verseData.data.surah.number}:${verseData.data.number}`,
              verseNumber: verseData.data.number,
              verseText: verseData.data.text,
              surahName: verseData.data.surah.name,
              surahNumber: verseData.data.surah.number,
              translation: verseData.data.translation,
              audioUrl: verseData.data.audioSecondary?.[0]
            };
            
            setVerses([formattedVerse]);
          } else {
            setVerses([]);
            setError('Verse data is incomplete or malformed.');
          }
        } else {
          setVerses([]);
          setError('No verses found. Please try a different search term.');
        }
      }
    } catch (err) {
      setError('Failed to fetch Quranic content. Please try again later.');
      console.error('Quran API error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Islamic Library</h1>
      
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search verses by surah name or verse number..."
            className="flex-1 p-2 border rounded"
            aria-label="Search Quran verses"
          />
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {verses.length === 0 ? (
            <p className="text-gray-500 italic">Enter a surah name or verse number to search</p>
          ) : (
            verses.map((verse) => (
              <div 
                key={verse.verseId} 
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">
                    {verse.surahName} {verse.verseNumber}
                  </h3>
                  {verse.audioUrl && (
                    <audio controls className="w-40">
                      <source src={verse.audioUrl} type="audio/mp3" />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </div>
                <p className="text-lg my-2">{verse.verseText}</p>
                <p className="text-sm text-gray-600">— {verse.translation}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
