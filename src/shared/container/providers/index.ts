import { container } from 'tsyringe';

import { IDateProvider } from './DateProvider/IDateProvider';
import { DayjsDateProvider } from './DateProvider/implementations/DayjsDateProvider';
import { IMailProvider } from './MailProvider/IMailProvider';
import { EtherealMailProvider } from './MailProvider/implementations/EtherealMailProvider';
import { IStorageProvider } from './StorageProvider/IStorageProvider';
import { LocalStorageProvider } from './StorageProvider/implementations/LocalStorageProvider';

container.registerSingleton<IDateProvider>('DateProvider', DayjsDateProvider);

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  LocalStorageProvider
);

const mailService = {
  ethereal: container.resolve(EtherealMailProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  mailService[process.env.MAIL_PROVIDER || 'ethereal']
);
