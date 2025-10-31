import { configure } from '@/app';
import { config } from '@/config';

configure(config.port)
  .then((http) => http.start())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
