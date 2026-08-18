const { AccessToken } = require('livekit-server-sdk');
const CallLog = require('../models/CallLog');

const getJoinToken = async (req, res) => {
  try {
    const { roomName, participantName } = req.body;

    if (!roomName || !participantName) {
      return res.status(400).json({ error: 'roomName and participantName are required' });
    }

    // Database log
    await CallLog.create({ roomName, participantName });

    // LiveKit AccessToken Init
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      console.error('LIVEKIT_API_KEY or LIVEKIT_API_SECRET missing in .env');
      return res.status(500).json({ error: 'Server misconfigured' });
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
      name: participantName,
      ttl: '10m', // Token validity
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();
    return res.json({ token });
  } catch (error) {
    console.error('Error in getJoinToken:', error);
    return res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = { getJoinToken };