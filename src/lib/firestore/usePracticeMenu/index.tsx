import { Menu, UserAuth } from '../../../models/users';
import { db } from '../../firebase';

const fetchAnnualData = async (user: UserAuth | null, year: number) => {
  if (user === null) return;
  const practicesRef = db
    .collection('users')
    .doc(user.uid)
    .collection('practices')
    .where('dateId', '>=', year);
  await practicesRef.get().then((snapshot) => {
    let nameList: string[] = [];
    const menuData = snapshot.docs.map((doc) => {
      const data = doc.data() as Menu;
      const name = data.name;
      nameList.push(name);
      return { ...data };
    });
    const DeduplicationNameList = [...new Set(nameList)];
    return { DeduplicationNameList, menuData };
  });
};

export { fetchAnnualData };
