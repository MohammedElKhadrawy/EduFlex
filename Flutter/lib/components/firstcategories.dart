
import 'package:flutter/material.dart';

import '../screens/hight_school_level_one.dart';
import '../screens/middle_school_level_one.dart';
import '../screens/primary_stage.dart';
import 'levelsclass.dart';


class FirstCategories extends StatelessWidget {
  const FirstCategories({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 22.0, vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          LevelsClass(
            onTap: () => Navigator.of(context).push(
              MaterialPageRoute(builder: (context) => const PrimaryStagePage()),
            ),
            text: 'Primary Stage',
          ),
          LevelsClass(
            onTap: () => Navigator.of(context).push(
              MaterialPageRoute(
                  builder: (context) => const MiddleSchoolLevelOnePage()),
            ),
            text: 'Middle School',
          ),
          LevelsClass(
            onTap: () => Navigator.of(context).push(
              MaterialPageRoute(
                  builder: (context) => const HighSchoolLevelOnePage()),
            ),
            text: 'High School',
          ),
        ],
      ),
    );
  }
}
