export async function handleLogin(googleData: any) {
  const res = await fetch('/api/v1/auth/google', {
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
