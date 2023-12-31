import 'package:edu_flex/classes/class_color.dart';
import 'package:edu_flex/components/navigator_button.dart';
import 'package:edu_flex/components/verify_box.dart';
import 'package:edu_flex/screens/login_page.dart';
import 'package:edu_flex/screens/new_password_page.dart';
import 'package:flutter/material.dart';
import 'package:quickalert/models/quickalert_type.dart';
import 'package:quickalert/widgets/quickalert_dialog.dart';

class VerificationCode extends StatefulWidget {
  const VerificationCode({super.key});

  @override
  State<VerificationCode> createState() => _VerificationCodeState();
}

class _VerificationCodeState extends State<VerificationCode> {
  showAlert() {
    QuickAlert.show(
      context: context,
      type: QuickAlertType.info,
      text: 'Welcome back! Discover now!',
      title: 'Your code confirmed',
      onConfirmBtnTap: () => Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (context) => const NewPassword()),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        elevation: 0,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Padding(
            padding: EdgeInsets.all(16),
            child: Center(
              child: Text(
                'Verification Code',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w500,
                  fontFamily: 'Roboto',
                  color: ColorManager.logGrey,
                ),
              ),
            ),
          ),
          const Padding(
            padding: EdgeInsets.only(top: 10, bottom: 16),
            child: Center(
              child: Text(
                'The code send to your email******@gmail.com',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w300,
                  fontFamily: 'Roboto',
                  color: ColorManager.forgotGray,
                ),
              ),
            ),
          ),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 8, vertical: 22),
            child: Form(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Expanded(child: VerifyBox()),
                  Expanded(child: VerifyBox()),
                  Expanded(child: VerifyBox()),
                  Expanded(child: VerifyBox()),
                  Expanded(child: VerifyBox()),
                  Expanded(child: VerifyBox()),
                ],
              ),
            ),
          ),
          const Center(
            child: Text(
              'Resend in 01:00',
              style: TextStyle(
                color: Color(0xff919191),
                fontFamily: 'Roboto',
                fontWeight: FontWeight.w400,
                fontSize: 16,
              ),
            ),
          ),
          MyNavigatorButton(
              onTap: () => showAlert(),
              height: 52,
              width: 242,
              color: ColorManager.mainGreen,
              text: 'Verify')
        ],
      ),
    );
  }
}
