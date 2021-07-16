export async function handleLogin(googleData: any) {

  console.log(googleData.tokenId);

  const res = await fetch('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify({
      token: googleData.tokenId,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  const data = await res.json();
  console.log(data);
}
