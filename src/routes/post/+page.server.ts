import { error } from '@sveltejs/kit';

import dotenv from 'dotenv';

dotenv.config();

export const load = async () => {
  try {
    return { body: { mceKey: process.env.TINYMCEKEY } };   
  } catch (err) {
    console.error('Caught Error: ', err);
    throw err;
  }
}