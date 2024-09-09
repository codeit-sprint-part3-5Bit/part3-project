import { ProfileSummary } from "@/types/wiki";

interface ProfileSummaryList {
  wikiItemList: ProfileSummary[];
  className?: string;
}

const ProfileList = ({ wikiItemList, className = "" }: ProfileSummaryList) => {
  return (
    <ul>
      {wikiItemList.map((Item) => (
        <li key={Item.id}>
          {Item.image}
          {Item.job}
          {Item.nationality}
          {Item.city}
          {Item.code}
          <div className="text-red-200">{Item.name}</div>
          {Item.id}
        </li>
      ))}
    </ul>
  );
};

export default ProfileList;
