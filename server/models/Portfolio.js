import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'main',
      unique: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

export const Portfolio = mongoose.model('Portfolio', portfolioSchema);
