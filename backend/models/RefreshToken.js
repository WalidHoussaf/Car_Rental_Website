import mongoose from 'mongoose';
import crypto from 'crypto';

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  createdByIp: {
    type: String
  },
  revokedAt: {
    type: Date
  },
  revokedByIp: {
    type: String
  },
  revokedReason: {
    type: String
  },
  replacedByToken: {
    type: String
  }
}, {
  timestamps: true
});

// Index for automatic cleanup of expired tokens
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual property to check if token is expired
refreshTokenSchema.virtual('isExpired').get(function() {
  return Date.now() >= this.expiresAt;
});

// Virtual property to check if token is active
refreshTokenSchema.virtual('isActive').get(function() {
  return !this.revokedAt && !this.isExpired;
});

// Static method to generate refresh token
refreshTokenSchema.statics.generateToken = function() {
  return crypto.randomBytes(40).toString('hex');
};

// Static method to create refresh token for user
refreshTokenSchema.statics.createToken = async function(userId, ipAddress) {
  const token = this.generateToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); 

  const refreshToken = await this.create({
    token,
    user: userId,
    expiresAt,
    createdByIp: ipAddress
  });

  return refreshToken;
};

// Instance method to revoke token
refreshTokenSchema.methods.revoke = async function(ipAddress, reason = 'Revoked by user') {
  this.revokedAt = Date.now();
  this.revokedByIp = ipAddress;
  this.revokedReason = reason;
  await this.save();
};

export default mongoose.model('RefreshToken', refreshTokenSchema);
