using System;
using System.Security.Cryptography;
using System.Text;
// ReSharper disable UnusedMember.Local
// ReSharper disable InvalidXmlDocComment

namespace NordSamples.Data
{
    /// <summary>
    /// Computes the phpBB/SubMD5 hash value for the input data using the implementation provided by http://openwall.com/phpass/ modified by http://www.phpbb.com/.
    /// </summary>
    /// <remarks>
    /// Ported by Ryan Irecki
    /// Website: http://www.digilitepc.net/
    /// Help: https://www.phpbb.com/community/viewtopic.php?f=71&t=1771165
    /// E-mail: razchek@gmail.com
    /// </remarks>
    public class PhpBbCryptoServiceProvider
    {
        /// <summary>
        /// The encryption string base.
        /// </summary>
        private const string EncryptionStringBase = "./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

        /// <summary>
        /// Compares the password string given with the hash retrieved from your database.
        /// </summary>
        /// <param name="password">Plaintext password.</param>
        /// <param name="hash">Hash from a SQL database</param>
        /// <returns>True if the password is correct, False otherwise.</returns>
        private static bool PhpBbCheckHash(string password, string hash)
        {
            if (hash.Length == 34)
            {
                return (HashCryptPrivate(Encoding.ASCII.GetBytes(password), hash, EncryptionStringBase) == hash);
            }

            return false;
        }

        /// <summary>
        /// This function will return the resulting hash from the password string you specify.
        /// </summary>
        /// <param name="password">String to hash.</param>
        /// <returns>Encrypted hash.</returns>
        /// <remarks>
        /// Although this will return the md5 for an older password, I have not added
        /// support for older passwords, so they will not work with this class unless
        /// I or someone else updates it.
        /// </remarks>
        private static string PhpBbHash(string password)
        {
            // Generate a random string from a random number with the length of 6.
            // You could use a static string instead, doesn't matter. E.g.
            // byte[] random = ASCIIEncoding.ASCII.GetBytes("abc123");
            byte[] random = Encoding.ASCII.GetBytes(new Random().Next(100000, 999999).ToString());

            string hash = HashCryptPrivate(Encoding.ASCII.GetBytes(password), HashGenSaltPrivate(random, EncryptionStringBase), EncryptionStringBase);

            return hash.Length == 34 ? hash : Smd5(password);
        }


        /// <summary>
        /// The workhorse that encrypts your hash.
        /// </summary>
        /// <param name="password">String to be encrypted. Use: ASCIIEncoding.ASCII.GetBytes();</param>
        /// <param name="genSalt">Generated salt.</param>
        /// <param name="encryptionStringBase">The itoa64 string.</param>
        /// <returns>The encrypted hash ready to be compared.</returns>
        /// <remarks>
        /// password:  Saves conversion inside the function, lazy coding really.
        /// genSalt:   Returns from hashGensaltPrivate(random, itoa64);
        /// return:    Compare with phpbbCheckHash(password, hash)
        /// </remarks>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Globalization", "CA1307:Specify StringComparison", Justification = "<Pending>")]
        private static string HashCryptPrivate(byte[] password, string genSalt, string encryptionStringBase)
        {
            var output = "*";
#pragma warning disable CA5351 // Do Not Use Broken Cryptographic Algorithms
            using var md5 = new MD5CryptoServiceProvider();
#pragma warning restore CA5351 // Do Not Use Broken Cryptographic Algorithms
            if (!genSalt.StartsWith("$H$"))
            {
                return output;
            }

            int countLog2 = encryptionStringBase.IndexOf(genSalt[3]);

            if (countLog2 < 7 || countLog2 > 30)
            {
                return output;
            }

            int count = 1 << countLog2;
            byte[] salt = Encoding.ASCII.GetBytes(genSalt.Substring(4, 8));

            if (salt.Length != 8)
            {
                return output;
            }

            byte[] hash = md5.ComputeHash(Combine(salt, password));

            do
            {
                hash = md5.ComputeHash(Combine(hash, password));
            }
            while (count-- > 1);

            output = genSalt.Substring(0, 12);
            output += HashEncode64(hash, 16, encryptionStringBase);

            return output;
        }

        /// <summary>
        /// Private function to concat byte arrays.
        /// </summary>
        /// <param name="b1">Source array.</param>
        /// <param name="b2">Array to add to the source array.</param>
        /// <returns>Combined byte array.</returns>
        private static byte[] Combine(byte[] b1, byte[] b2)
        {
            var retVal = new byte[b1.Length + b2.Length];
            Array.Copy(b1, 0, retVal, 0, b1.Length);
            Array.Copy(b2, 0, retVal, b1.Length, b2.Length);
            return retVal;
        }

        /// <summary>
        /// Encode the hash.
        /// </summary>
        /// <param name="input">The hash to encode.</param>
        /// <param name="count">[This parameter needs documentation].</param>
        /// <param name="encryptionStringBase">The itoa64 string.</param>
        /// <returns>Encoded hash.</returns>
        private static string HashEncode64(byte[] input, int count, string encryptionStringBase)
        {
            var output = "";
            var i = 0;

            do
            {
                int value = input[i++];
                output += encryptionStringBase[value & 0x3f];

                if (i < count)
                {
                    value |= input[i] << 8;
                }

                output += encryptionStringBase[(value >> 6) & 0x3f];
                if (i++ >= count)
                {
                    break;
                }

                if (i < count)
                {
                    value |= input[i] << 16;
                }

                output += encryptionStringBase[(value >> 12) & 0x3f];
                if (i++ >= count)
                {
                    break;
                }

                output += encryptionStringBase[(value >> 18) & 0x3f];

            } while (i < count);

            return output;
        }

        /// <summary>
        /// Generate salt for hash generation.
        /// </summary>
        /// <param name="input">Any random information.</param>
        /// <param name="encryptionStringBase">The itoa64 string.</param>
        /// <returns>Generated salt string</returns>
        private static string HashGenSaltPrivate(byte[] input, string encryptionStringBase)
        {
            const int iterationCountLog2 = 6;

            var output = "$H$";
            output += encryptionStringBase[Math.Min(iterationCountLog2 + 5, 30)];
            output += HashEncode64(input, 6, encryptionStringBase);

            return output;
        }


        /// <summary>
        /// Returns a hexadecimal string representation for the encrypted MD5 parameter.
        /// </summary>
        /// <param name="password">String to be encrypted.</param>
        /// <param name="raw">Whether or not to produce a raw string.</param>
        /// <returns>String</returns>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Security", "CA5351:Do Not Use Broken Cryptographic Algorithms", Justification = "<Pending>")]
        private static string Smd5(string password, bool raw = false)
        {
            using var md5 = new MD5CryptoServiceProvider();
            string returnValue = raw ? Encoding.ASCII.GetString(md5.ComputeHash(Encoding.ASCII.GetBytes(password))) : BitConverter.ToString(md5.ComputeHash(Encoding.ASCII.GetBytes(password))).Replace("-", "");
            return returnValue;
        }
    }
}