import FastfoodIcon from '@mui/icons-material/Fastfood';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MovieIcon from '@mui/icons-material/Movie';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PaidIcon from '@mui/icons-material/Paid';
import SavingsIcon from '@mui/icons-material/Savings';

export const expenseCategories = [
  { label: "Groceries", icon: FastfoodIcon },
  { label: "Transport", icon: DirectionsCarIcon },
  { label: "Shopping", icon: ShoppingCartIcon },
  { label: "Bills", icon: ReceiptIcon },
  { label: "Health", icon: LocalHospitalIcon },
  { label: "Entertainment", icon: MovieIcon },
  { label: "Rent", icon: HomeIcon },
  { label: "Mobile", icon: PhoneIphoneIcon },
  { label: "Other", icon: MoreHorizIcon },
];

export const incomeCategories = [
  { label: "Salary", icon: PaidIcon },
  { label: "Interest", icon: SavingsIcon },
  { label: "Gift", icon: AccountBalanceWalletIcon },
  { label: "Other", icon: MoreHorizIcon },
];