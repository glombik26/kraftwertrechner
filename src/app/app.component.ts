import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'kraftwertrechner';
  fgBasisEingabe!: FormGroup;
  mapProzentualeGewichte!: Map<number, number>;

  constructor(private formBuilder: FormBuilder) {
    this.fgBasisEingabe = this.formBuilder.group({
      gewicht: new FormControl<number>(0),
      wiederholungen: new FormControl<number>(0),
    });
    this.fgBasisEingabe.valueChanges.subscribe(
      (value: { gewicht: number; wiederholungen: number }) =>
        this.handleWiederholungenChange(value),
    );
    this.mapProzentualeGewichte = this.initMapProzentualeGewichte(
      this.fgBasisEingabe.controls['gewicht'].value,
      this.fgBasisEingabe.controls['wiederholungen'].value,
    );
  }

  private initMapProzentualeGewichte(
    gewicht: number,
    wiederholungen: number,
  ): Map<number, number> {
    const result: Map<number, number> = new Map<number, number>();
    const maximalGewicht: number = this.berechneMaximalGewicht(
      gewicht,
      wiederholungen,
    );

    for (let i: number = 30; i <= 100; i += 10) {
      result.set(i, this.berechneProzentualesGewicht(i, maximalGewicht));
    }
    return result;
  }

  private berechneMaximalGewicht(gewicht: number, wiederholungen: number) {
    return gewicht * 2;
  }

  private berechneProzentualesGewicht(
    prozentsatz: number,
    maximalGewicht: number,
  ) {
    return (maximalGewicht * prozentsatz) / 100;
  }

  private handleWiederholungenChange(value: {
    gewicht: number;
    wiederholungen: number;
  }) {
    this.mapProzentualeGewichte = this.initMapProzentualeGewichte(
      value.gewicht,
      value.wiederholungen,
    );
  }
}
