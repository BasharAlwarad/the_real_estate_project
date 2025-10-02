import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  userName: string;
  email: string; // Fixed: changed from number to string
  image: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    userName: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      minlength: [2, 'Username must be at least 2 characters'],
      maxlength: [50, 'Username cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    image: {
      type: String,
      default:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMYAAACUCAMAAAD/A6aTAAAAXVBMVEX///+cnaGZmp6cnZ/7+/v09PSWl5v///339/fl5eaZmpzq6uudnKKSk5Xb29vv7/DU1NW6ubympqnMzM2wsLK/wMLGxsiQj5a1trWzs7iXl5be3+KkpaSrq6vT1NnKmNs9AAAG10lEQVR4nO1c7XajIBANjFJFUEQxpql9/8dcNE2bTSOQKGjP4f7Zs3tWw5X5hJk5HCIiIiIiIiIiIiIiIiI2xduErVexEEmWamTJ1ut4FVmRl6LpVD1BdY0o8yLbelVPIctFV7cSkQkY4/EPimRbdyL/I1SyUrUfoNeO0R30P1H4aFW5fyaFkoz9ZnDDhTEmVbH1Ok1ISknIPIMfEDKUe9X6VAA3bMMdEQ4i3XrFD5AKSZgrCQ3GdkgkK1uul/YUDURJuy9tzxVyFqdbYFD51mv/RtJIJ8V+AKCy2Xr5X6h69tJWXDekrbZmMKKg9HUSIwjagRcRHGAZDYS42JhE0hFYTgNos6kzTNUCrbgFVhu6kNVYIES345Gphcp9A6D1RnKV1GSxVtyA1NvQWE+ivnioLVh0K7NA6H0Dhy6c9GJMAhlmOgth9rgR8GdoFrm0b4ZOAqXOvzVaKZEpJbw+IAMHimlv3QwMgxL5xYwmaS5qaY+CcRvU7CYdNRkp7dgxbZviPxOaFKIl2JKT0C6k2T0bY1rNgoB4ELdWAqiFBgQUq2ww5hcAvJ1ZTd4aM10AOoTLBxtLlsS7WRFPlelZvY88mNVNLXthFHCtVuZvQENpeW+mQTvz4x026gftw7AouJmFLcZLarPh5WGSwda4CiqtQlEZXSfgNgSL3Gz6SWl/xdliIkIY3d4o2vjk8o6TcUNxgJDdHEwxN8E2qxeW/rWjMX9IR7k26xf27jsq8wL42e0156P5Y/g+gStNP69DWEfflRpfA8jBTixB0hmNzHvvGKAmxpgEEc+BrkWmiKtQvwkjDd9SZXEa3FkYzK6DeXYd5o+IsPOv5+aAhHg91c1qsyyAs8EvjCwQqX2mHelgjLKfomH2HPbIbAEKi0ytthuI+HTkFtVA7pl0bjm24j6PrMxeQ39DRyeuadjeZMm9liAxR6bPXBvZ9hW7OtJXaNiOCp29r8WLjzrukYbt3tjZwKS2DwLcH43MmCZMP+5oYMwJx/Qmf46jsv64q2babAVCR39RVW7MEkYaQJxkIePWa4Kjv6iqtO4GuF0Z2RR8pOEr5XizWskR2EEYKoeLKm/BoSMNu8G3up9pN7algag1dWpc7ts23g17Il1Kl3tojzSsKj4BS2NkdZZOl58eVTx3oqHjdQOPMxjv235o+DO4Vvf3BUrmKnKShjtW/HB/7i91pKEXMVQPiCTVyfUNwP2lf4kzDURod19YnxUdcq5J9BkaWgP1GzAiVfnDJCtKJYn7414DdRe/9bMSimTdNUKj6eoBPUFivDrzeG5oD0zvmdBJo4HSJwtlfCaxh8+n623xpYfj6ee8HikU7y7GEsZiC4YJJ+hjGNq+b4cP0FaYOFS/XOH1gMeae14wipKsRX5rdJO0ELUEcJMuv8dtlsPPywowkn0z8zEL0TuVJPk9/LQHh5jobbg44P/75L7/UulNsRotv0fRtosBTaI72/ONc2chwjwX8pivaYicE6Z7FOYmA+L5mma2cAVG5e0KZ5+VFB3ME/F9aXYoZywuAB+etJFFy2dexnxfYc5K1Ut1UM1MSxc+eW/peJxIv1hYUMz4If+lYcWDHBSz+kVvldbwm0iIYovD79JVjLqXnVXW/b49C1H6csjv9FJHsGKBXUkEus9qQ1R/vt2XrQBdaFbKuzOGIGVhb3f3mOB+pT+H/8+NmNfg9godGp1ueazRXiVueRCnwrIVkP5kHSuVzTY37WrBClh/yomBqlWihqT7/jLO1TPL8V3cTdaq8P8ODkgbsNn3fDH2K/ZbfJUw4pCl9t/VYSsKgJikKnAfYzWeWOE1e9ymWunAbSiTEIBcNQ6tJARvCtJC8A7rynGOKA3eonU4dJya7jGexRkxW6uBHyhCYbUsrZR4m/bFw6EmBFY6iBGIbNVMOjbFUljFQjZAPR+wmZAqSqla/POZYlqiNm0Yf6e0XRhYFz3Hm7a9X4YQULlI0UtJ4T1o1+IjCA5LBCvTchmwSW4eBeh1oNcGHCUl0l/BvezVJ6pe7wfvX4hMqp5gDP1e5vAISYDjR12wJlQCcx3rN/uZspcrRBgZpvN0x+l/hRj0I2hHo4QO42CnE8GUDs24KgcaedeOk+lO+xrsdLjMCqMUy9q+suxcS02CD597G7M1Iv0EzjBDUuWm/cjVB2K7nBV2xTSCTi+R4PaxvqefNZ7+A5G7HUE3oVDjTSsmnNNWiXNVpROqKheqpXwa1oh2PhBwwjieUVMhmJDjkWDGpEQMH48jBaIptOq8N72ewTgs83QdlnkttyCawenvDMv8wnV0qfq7o0tv8NcHyUZERERERERERERERETsCP8Abb9TXgYWiWYAAAAASUVORK5CYII=',
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);
