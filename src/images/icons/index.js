import { AiFillEye, AiFillEyeInvisible, AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import { BiStore } from 'react-icons/bi';
import {
  BsCamera,
  BsFillImageFill,
  BsFillLockFill,
  BsFillQuestionCircleFill,
  BsFillUnlockFill,
  BsFilter,
  BsLink45Deg,
  BsSearch,
  BsSend,
} from 'react-icons/bs';
import { CgNotes } from 'react-icons/cg';
import { CiExport } from 'react-icons/ci';
import { FaExpand, FaPlayCircle, FaRegCopy } from 'react-icons/fa';
import { FaArrowRotateRight, FaRegPaste } from 'react-icons/fa6';
import { FiEdit3, FiMapPin, FiUser } from 'react-icons/fi';
import { GoDotFill, GoGear } from 'react-icons/go';
import { ImQrcode } from 'react-icons/im';
import { IoIosSync } from 'react-icons/io';
import {
  IoAddOutline,
  IoArrowBack,
  IoArrowForward,
  IoCloudUploadOutline,
  IoReload,
  IoSaveOutline,
} from 'react-icons/io5';
import { LuShrink } from 'react-icons/lu';
import { MdBrowserUpdated, MdOutlineAttachFile, MdOutlineClear, MdOutlineOndemandVideo } from 'react-icons/md';
import { PiWarningCircleBold } from 'react-icons/pi';
import { RiDeleteBinLine, RiFolderVideoLine } from 'react-icons/ri';
import { TbDevicesCheck, TbListDetails } from 'react-icons/tb';
import { TiFlowMerge, TiTick, TiTimes } from 'react-icons/ti';
const Icons = {
  User: FiUser,
  Copy: FaRegCopy,
  Past: FaRegPaste,
  Expand: FaExpand,
  Shrink: LuShrink,
  Play: FaPlayCircle,
  Note: CgNotes,
  CheckApp: TbDevicesCheck,
  Update: MdBrowserUpdated,
  Upload: IoCloudUploadOutline,
  Sync: IoIosSync,
  Reload: IoReload,
  Gear: GoGear,
  Video: MdOutlineOndemandVideo,
  VideoFolder: RiFolderVideoLine,
  Warning: PiWarningCircleBold,
  Camera: BsCamera,
  Attach: MdOutlineAttachFile,
  Image: BsFillImageFill,
  RotateRight: FaArrowRotateRight,
  Tick: TiTick,
  Question: BsFillQuestionCircleFill,
  Cancel: TiTimes,
  EyeOpen: AiFillEye,
  EyeClose: AiFillEyeInvisible,
  Search: BsSearch,
  Filter: BsFilter,
  UnLock: BsFillUnlockFill,
  Lock: BsFillLockFill,
  Link: BsLink45Deg,
  Dot: GoDotFill,
  Export: CiExport,
  Delete: RiDeleteBinLine,
  Clear: MdOutlineClear,
  Send: BsSend,
  Plus: AiOutlinePlusCircle,
  PlusNoRounded: IoAddOutline,
  Minus: AiOutlineMinusCircle,
  Details: TbListDetails,
  ArrowLeft: IoArrowBack,
  ArrowRight: IoArrowForward,
  Save: IoSaveOutline,
  Edit: FiEdit3,
  Store: BiStore,
  Merge: TiFlowMerge,
  QRCode: ImQrcode,
  Map: FiMapPin,
};
export default Icons;
