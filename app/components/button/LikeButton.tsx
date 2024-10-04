// components/LikeButton.tsx
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface LikeButtonProps {
  isLiked: boolean;
  onLike: () => void;
  likeCount: number;
  disabled?: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({ isLiked, onLike, likeCount, disabled }) => {
  return (
    <div className="flex items-center">
      <button onClick={onLike} className={`mr-2 ${disabled ? 'text-gray-400' : isLiked ? 'text-red-600' : 'text-red-500 hover:text-red-600'}`}>
        {isLiked ? <HeartSolidIcon className="h-6 w-6 text-red-600" /> : <HeartIcon className="h-6 w-6" />}
      </button>
      <span className="text-sm font-semibold">{likeCount}人がいいね!</span>
    </div>
  );
};

export default LikeButton;
