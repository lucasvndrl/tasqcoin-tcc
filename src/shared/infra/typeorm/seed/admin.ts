import { v4 as uuidV4 } from 'uuid';
import { hash } from 'bcrypt';

import createConnection from '..';

async function create() {
  const connection = await createConnection();

  const id = uuidV4();
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email) throw new Error('E-mail argument was not provided');
  if (!password) throw new Error('Password argument was not provided');

  const password_hash = await hash('admin', 8);

  await connection.query(
    `INSERT INTO USERS(id, name, email, password, is_admin, created_at, balance)
      values('${id}', 'admin', '${email}', '${password_hash}', 'true', 'now()', '999999')
    `
  );

  await connection.close();
}

create()
  .then(() => console.log('User admin was created!'))
  .catch(({ message }: Error) => console.log(message));
