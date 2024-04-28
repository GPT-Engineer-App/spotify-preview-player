// Complete the Index page component here
// Use chakra-ui
import { Box, Input, Button, Text, VStack, Image, useToast, useEffect } from '@chakra-ui/react';
import { useState } from 'react';

const Index = () => {
  const [search, setSearch] = useState('');
  const [songData, setSongData] = useState(null);
  const toast = useToast();

const fetchToken = async () => {
  try {
    const response = await fetch('/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&client_secret=${process.env.REACT_APP_SPOTIFY_CLIENT_SECRET}`
    });
    const data = await response.json();
    localStorage.setItem('spotifyToken', data.access_token);
  } catch (error) {
    toast({
      title: 'Failed to refresh token',
      description: error.message,
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  }
};

  useEffect(() => {
    fetchToken();
  }, []);

  const handleSearch = async () => {
    const token = localStorage.getItem('spotifyToken');
    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(search)}&type=track&limit=1`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.tracks && data.tracks.items.length > 0) {
        setSongData(data.tracks.items[0]);
      } else {
        toast({
          title: "No results found.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        setSongData(null);
      }
    } catch (error) {
      toast({
        title: "Error searching for song.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={4} align="center" justify="center" height="100vh">
      <Text fontSize="2xl" fontWeight="bold">Spotify Song Search</Text>
      <Input placeholder="Search for a song" value={search} onChange={(e) => setSearch(e.target.value)} />
      <Button onClick={handleSearch} colorScheme="teal">Search</Button>
      {songData && (
        <Box textAlign="center">
          <Text fontSize="xl">{songData.name}</Text>
          <Text fontSize="md">by {songData.artists.map(artist => artist.name).join(', ')}</Text>
          <Image src={songData.album.images[0].url} alt="Album cover" boxSize="100px" />
          <audio controls src={songData.preview_url}>
            Your browser does not support the audio element.
          </audio>
        </Box>
      )}
    </VStack>
  );
};

export default Index;