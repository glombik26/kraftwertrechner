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
  mapProzentualeGewichte!: Map<
    number,
    { anzahlWiederholungen: string; gewicht: string }
  >;
  selektierbareGewichte!: number[];
  selektierbareWiederholungen!: number[];

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
    this.selektierbareGewichte = Array(20)
      .fill(null)
      .map((x, i) => ++i * 5);
    this.selektierbareWiederholungen = Array(25)
      .fill(null)
      .map((x, i) => ++i);
  }

  private initMapProzentualeGewichte(
    gewicht: number,
    wiederholungen: number,
  ): Map<number, { anzahlWiederholungen: string; gewicht: string }> {
    if (gewicht <= 0 || wiederholungen <= 0) return this.getLeereGewichteMap();
    const result: Map<
      number,
      { anzahlWiederholungen: string; gewicht: string }
    > = new Map<number, { anzahlWiederholungen: string; gewicht: string }>();
    const maximalGewicht: number = this.berechneMaximalGewicht(
      gewicht,
      wiederholungen,
    );

    for (let i: number = 30; i <= 100; i += 10) {
      result.set(i, {
        anzahlWiederholungen: this.mapAnzahlWiederholungen.get(i) ?? '',
        gewicht: this.berechneProzentualesGewicht(i, maximalGewicht),
      });
    }
    return result;
  }

  private berechneMaximalGewicht(gewicht: number, wiederholungen: number) {
    return +(gewicht / (1.0278 - 0.0278 * wiederholungen)).toFixed(1);
  }

  private berechneProzentualesGewicht(
    prozentsatz: number,
    maximalGewicht: number,
  ) {
    return ((maximalGewicht * prozentsatz) / 100).toFixed(1);
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

  handleGewichtInKgChipClick($value: number) {
    this.fgBasisEingabe.controls['gewicht'].setValue($value);
  }

  handleWiederholungenChipClick($value: number) {
    this.fgBasisEingabe.controls['wiederholungen'].setValue($value);
  }

  private getLeereGewichteMap(): Map<
    number,
    { anzahlWiederholungen: string; gewicht: string }
  > {
    return new Map<number, { anzahlWiederholungen: string; gewicht: string }>([
      [100, { anzahlWiederholungen: '0', gewicht: '0,0' }],
      [90, { anzahlWiederholungen: '0', gewicht: '0,0' }],
      [80, { anzahlWiederholungen: '0', gewicht: '0,0' }],
      [70, { anzahlWiederholungen: '0', gewicht: '0,0' }],
      [60, { anzahlWiederholungen: '0', gewicht: '0,0' }],
      [50, { anzahlWiederholungen: '0', gewicht: '0,0' }],
      [40, { anzahlWiederholungen: '0', gewicht: '0,0' }],
      [30, { anzahlWiederholungen: '0', gewicht: '0,0' }],
    ]);
  }

  private readonly mapAnzahlWiederholungen: Map<number, string> = new Map<
    number,
    string
  >([
    [100, '1'.padStart(2) + ' - ' + '2'.padStart(2)],
    [90, '3'.padStart(2) + ' - ' + '4'.padStart(2)],
    [80, '7'.padStart(2) + ' - ' + '9'.padStart(2)],
    [70, '13'.padStart(2) + ' - ' + '15'.padStart(2)],
    [60, '20'.padStart(2) + ' - ' + '24'.padStart(2)],
    [50, '25'.padStart(2) + ' - ' + '30'.padStart(2)],
    [40, ''.padStart(2) + ' > ' + '30'.padStart(2)],
  ]);
}
